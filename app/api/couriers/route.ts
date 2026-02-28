import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cargo } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import logger, { apiLogger } from "@/lib/logger";

/**
 * Mengambil daftar kurir/cargo yang aktif.
 * Digunakan untuk opsi pengiriman di halaman checkout.
 *
 * @auth none
 * @method GET
 * @response 200 — Cargo[] (array of active courier objects)
 * @response 500 — { message: "error", error: "Terjadi kesalahan sistem" }
 */
export async function GET() {
    logger.debug("API Request: GET /api/couriers");
    try {
        const couriers = await db.select()
            .from(cargo)
            .where(eq(cargo.isAktif, 1));

        return NextResponse.json(couriers);
    } catch (error: any) {
        apiLogger.error(null, error, { route: "/api/couriers" });
        return NextResponse.json({ message: "error", error: "Terjadi kesalahan sistem" }, { status: 500 });
    }
}

