import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rekeningPembayaran } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import logger, { apiLogger } from "@/lib/logger";

/**
 * Mengambil daftar metode pembayaran (rekening bank/E-Wallet) yang aktif.
 *
 * @auth none
 * @method GET
 * @response 200 — RekeningPembayaran[] (array of active payment method objects)
 * @response 500 — { message: "error", error: "Terjadi kesalahan sistem" }
 */
export async function GET() {
    logger.debug("API Request: GET /api/payment-methods");
    try {
        const methods = await db.select()
            .from(rekeningPembayaran)
            .where(eq(rekeningPembayaran.isAktif, 1));

        return NextResponse.json(methods);
    } catch (error: any) {
        apiLogger.error(null, error, { route: "/api/payment-methods" });
        return NextResponse.json({ message: "error", error: "Terjadi kesalahan sistem" }, { status: 500 });
    }
}

