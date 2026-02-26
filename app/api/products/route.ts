import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-utils";
import logger from "@/lib/logger";
import { CustomerService } from "@/lib/services/customer-service";
import { ProductService } from "@/lib/services/product-service";
import { produk, produkDetail } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

/**
 * Handler untuk mengambil daftar produk (highlighted/online).
 * Menyesuaikan harga berdasarkan kategori customer (distributor, agen, reseller, dll).
 * Mengecek status Flash Sale dan Pre-Order untuk setiap produk.
 */
export async function GET(request: NextRequest) {
    logger.info("API Request: GET /api/products");
    try {
        const { searchParams } = new URL(request.url);
        const categories = searchParams.get("categories")?.split(",").filter(Boolean);
        const priceRanges = searchParams.get("priceRanges")?.split(",").filter(Boolean);
        const colors = searchParams.get("colors")?.split(",").filter(Boolean);
        const sizes = searchParams.get("sizes")?.split(",").filter(Boolean);

        const session = await getSession();
        const kategoriId = await CustomerService.getKategoriId(session?.user?.id);

        logger.debug("Products Fetch: Using kategoriId", { kategoriId, categories, priceRanges, colors, sizes });

        const processData = await ProductService.getProducts({
            kategoriId,
            limit: 50,
            categories,
            priceRanges,
            colors,
            sizes,
            where: eq(produk.isOnline, 1),
            // Urutkan berdasarkan stok terbanyak (sesuai logika legacy)
            orderBy: sql`SUM(${produkDetail.stokNormal}) DESC`
        });

        logger.info("Products Fetch: Success", { count: processData.length });
        return NextResponse.json(processData);
    } catch (error: any) {
        logger.error("API Error: /api/products", { error: error.message });
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}


