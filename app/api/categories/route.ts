import { db } from "@/lib/db";
import { kategoriProduk } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import logger, { apiLogger } from "@/lib/logger";

/**
 * Mengambil daftar kategori produk.
 * Tanpa limit → semua kategori (filter sidebar).
 * Dengan ?limit=4 → 4 kategori (home page).
 *
 * @auth none
 * @method GET
 * @query {{ limit?: number }}
 * @response 200 — Array of kategori objects
 *   { id, namaKategori, ... }[]
 * @response 500 — { error: "Gagal mengambil data kategori" }
 */
export async function GET(request: NextRequest) {
    logger.info("API Request: GET /api/categories");
    try {
        const { searchParams } = new URL(request.url);
        const limitParam = searchParams.get("limit");

        let query = db.select().from(kategoriProduk);

        if (limitParam) {
            const limit = parseInt(limitParam, 10);
            if (!isNaN(limit) && limit > 0) {
                query = query.limit(limit) as any;
            }
        }

        const data = await query;

        logger.info("API Response: 200 /api/categories", { count: data.length });
        return NextResponse.json(data);
    } catch (error: any) {
        apiLogger.error(request, error);
        return NextResponse.json(
            { error: "Gagal mengambil data kategori" },
            { status: 500 }
        );
    }
}
