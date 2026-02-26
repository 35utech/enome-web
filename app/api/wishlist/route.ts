import { db } from "@/lib/db";
import { keranjangLove } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-utils";
import logger from "@/lib/logger";

/**
 * GET /api/wishlist — Ambil daftar produk_id yang di-wishlist oleh customer.
 */
export async function GET(request: NextRequest) {
    logger.info("API Request: GET /api/wishlist");
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ items: [] });
        }

        const custId = Number(session.user.id);

        const items = await db
            .select({ produkId: keranjangLove.produkId })
            .from(keranjangLove)
            .where(
                and(
                    eq(keranjangLove.custId, custId),
                    eq(keranjangLove.isDeleted, 0)
                )
            );

        const produkIds = [...new Set(items.map(i => i.produkId).filter(Boolean))];

        logger.info("API Response: 200 /api/wishlist", { count: produkIds.length });
        return NextResponse.json({ items: produkIds });
    } catch (error: any) {
        logger.error("API Error: 500 /api/wishlist", { error: error.message });
        return NextResponse.json({ error: "Gagal mengambil wishlist" }, { status: 500 });
    }
}

/**
 * POST /api/wishlist — Toggle wishlist item (add/remove) berdasarkan produk_id.
 * Body: { produkId: string }
 */
export async function POST(request: NextRequest) {
    logger.info("API Request: POST /api/wishlist");
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const custId = Number(session.user.id);
        const body = await request.json();
        const { produkId } = body;

        if (!produkId) {
            return NextResponse.json({ error: "produkId is required" }, { status: 400 });
        }

        // Check if item already exists and is not deleted
        const existing = await db
            .select()
            .from(keranjangLove)
            .where(
                and(
                    eq(keranjangLove.produkId, produkId),
                    eq(keranjangLove.custId, custId),
                    eq(keranjangLove.isDeleted, 0)
                )
            )
            .limit(1);

        if (existing.length > 0) {
            // Remove from wishlist (soft delete, sama seperti Yii)
            await db
                .update(keranjangLove)
                .set({ isDeleted: 1 })
                .where(
                    and(
                        eq(keranjangLove.produkId, produkId),
                        eq(keranjangLove.custId, custId),
                        eq(keranjangLove.isDeleted, 0)
                    )
                );

            logger.info("Wishlist: Removed", { produkId, custId });
            return NextResponse.json({ action: "removed", produkId });
        } else {
            // Add to wishlist
            await db.insert(keranjangLove).values({
                produkId,
                custId: custId,
                qtyProduk: 1,
                hargaPoduk: 0,
                status: 0,
                keterangan: "",
                tipeDiskon: "allin",
                isDeleted: 0,
                createdBy: custId,
            });

            logger.info("Wishlist: Added", { produkId, custId });
            return NextResponse.json({ action: "added", produkId });
        }
    } catch (error: any) {
        logger.error("API Error: 500 /api/wishlist", { error: error.message });
        return NextResponse.json({ error: "Gagal update wishlist" }, { status: 500 });
    }
}
