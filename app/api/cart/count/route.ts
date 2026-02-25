import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-utils";
import logger from "@/lib/logger";
import { CartService } from "@/lib/services/cart-service";

/**
 * Handler sederhana untuk mendapatkan jumlah total item (unique baris) di keranjang user.
 * Digunakan untuk menampilkan badge jumlah keranjang di Navbar.
 */
export async function GET(request: NextRequest) {
    logger.debug("API Request: GET /api/cart/count");
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ total: 0 });
        }

        const userId = session.user.id;
        const totalItems = await CartService.getCartCount(userId);

        return NextResponse.json({
            total: totalItems
        });

    } catch (error: any) {
        logger.error("API Error: /api/cart/count", { error: error.message });
        return NextResponse.json({ total: 0, error: error.message }, { status: 500 });
    }
}

