import { db } from "@/lib/db";
import { kategoriProduk } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import logger from "@/lib/logger";

/**
 * Handler untuk mengambil kategori produk.
 * Mendukung query param `limit` untuk membatasi jumlah hasil.
 * Tanpa limit → semua kategori (untuk filter sidebar).
 * Dengan ?limit=4 → 4 kategori (untuk home page).
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
        logger.error("API Error: 500 /api/categories", { error: error.message });
        return NextResponse.json(
            { error: "Gagal mengambil data kategori" },
            { status: 500 }
        );
    }
}
