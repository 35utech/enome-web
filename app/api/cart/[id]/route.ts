import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-utils";
import logger from "@/lib/logger";
import { getJakartaDate } from "@/lib/date-utils";
import { CartService } from "@/lib/services/cart-service";

/**
 * Handler untuk mengubah isi (PATCH) atau menghapus (DELETE) item dari keranjang.
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    logger.info("API Request: PATCH /api/cart/[id]", { id });

    try {
        const session = await getSession();
        if (!session) {
            logger.warn("Cart Update: Unauthorized");
            return NextResponse.json({ message: "login" }, { status: 401 });
        }

        const { qty, notes } = await request.json();

        if (isNaN(id)) {
            logger.warn("Cart Update: Invalid ID", { idStr });
            return NextResponse.json({ message: "bad_request" }, { status: 400 });
        }

        const updateData: any = { updatedAt: getJakartaDate() };
        if (typeof qty === 'number' && qty >= 1) updateData.qtyProduk = qty;
        if (typeof notes === 'string') updateData.keterangan = notes;

        // Melakukan update pada item keranjang milik user tersebut
        await CartService.updateCartItem(id, session.user.id, updateData);

        logger.info("Cart Update: Success", { id, qty, notes });
        return NextResponse.json({ message: "success" });

    } catch (error: any) {
        logger.error("API Error: /api/cart/[id] (PATCH)", { error: error.message, id });
        return NextResponse.json({ message: "error", error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    logger.info("API Request: DELETE /api/cart/[id]", { id });

    try {
        const session = await getSession();
        if (!session) {
            logger.warn("Cart Delete: Unauthorized");
            return NextResponse.json({ message: "login" }, { status: 401 });
        }

        if (isNaN(id)) {
            logger.warn("Cart Delete: Invalid ID", { idStr });
            return NextResponse.json({ message: "bad_request" }, { status: 400 });
        }

        // Soft delete dengan mengubah flag isDeleted menjadi 1
        await CartService.deleteCartItem(id, session.user.id, getJakartaDate());

        logger.info("Cart Delete: Success", { id });
        return NextResponse.json({ message: "success" });

    } catch (error: any) {
        logger.error("API Error: /api/cart/[id] (DELETE)", { error: error.message, id });
        return NextResponse.json({ message: "error", error: error.message }, { status: 500 });
    }
}

