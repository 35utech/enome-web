import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-utils";
import logger from "@/lib/logger";
import { CartService } from "@/lib/services/cart-service";

/**
 * Handler untuk mengambil isi keranjang belanja user.
 * Melakukan join dengan produk, warna, dan detail produk untuk mendapatkan data lengkap (stok, harga, gambar).
 * Menghitung total nominal dan total kuantitas barang di keranjang.
 */
export async function GET(request: NextRequest) {
    logger.info("API Request: GET /api/cart");
    try {
        const session = await getSession();
        if (!session) {
            logger.info("Cart Check: Anonymous cart requested (empty)");
            return NextResponse.json({ items: [], totalAmount: 0, totalQty: 0 });
        }

        const userId = session.user.id;
        const result = await CartService.getCartItems(userId);

        logger.info("Cart Check: Success", { userId, itemCount: result.items.length, totalAmount: result.totalAmount });
        return NextResponse.json(result);

    } catch (error: any) {
        logger.error("API Error: /api/cart", { error: error.message });
        return NextResponse.json({ items: [], totalAmount: 0, totalQty: 0, error: error.message }, { status: 500 });
    }
}

