import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { statusOrder, statusTagihan } from "@/lib/db/schema";
import logger, { apiLogger } from "@/lib/logger";

/**
 * Mengambil daftar master status order dan status tagihan.
 * Digunakan untuk dropdown filter di halaman riwayat pesanan.
 *
 * @auth none
 * @method GET
 * @response 200 — { orderStatuses: StatusOrder[], tagihanStatuses: StatusTagihan[] }
 * @response 500 — { message: "error", error: "Terjadi kesalahan sistem" }
 */
export async function GET(request: NextRequest) {
    logger.debug("API Request: GET /api/user/orders/statuses");
    try {
        const orderStatuses = await db.select().from(statusOrder);
        const tagihanStatuses = await db.select().from(statusTagihan);

        return NextResponse.json({
            orderStatuses,
            tagihanStatuses
        });
    } catch (error: any) {
        apiLogger.error(request, error);
        return NextResponse.json({ message: "error", error: "Terjadi kesalahan sistem" }, { status: 500 });
    }
}

