import { db } from "@/lib/db";
import { warna } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import logger, { apiLogger } from "@/lib/logger";

/**
 * Mengambil semua data warna dari database.
 *
 * @auth none
 * @method GET
 * @response 200 — { warnaId: string, warna: string, kodeWarna: string }[]
 * @response 500 — { error: "Gagal mengambil data warna" }
 */
export async function GET() {
    logger.info("API Request: GET /api/colors");
    try {
        const data = await db.select().from(warna);

        logger.info("API Response: 200 /api/colors", { count: data.length });
        return NextResponse.json(data);
    } catch (error: any) {
        apiLogger.error(null, error, { route: "/api/colors" });
        return NextResponse.json(
            { error: "Gagal mengambil data warna" },
            { status: 500 }
        );
    }
}
