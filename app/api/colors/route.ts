import { db } from "@/lib/db";
import { warna } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import logger from "@/lib/logger";

/**
 * Handler untuk mengambil semua data warna dari database.
 */
export async function GET() {
    logger.info("API Request: GET /api/colors");
    try {
        const data = await db.select().from(warna);

        logger.info("API Response: 200 /api/colors", { count: data.length });
        return NextResponse.json(data);
    } catch (error: any) {
        logger.error("API Error: 500 /api/colors", { error: error.message });
        return NextResponse.json(
            { error: "Gagal mengambil data warna" },
            { status: 500 }
        );
    }
}
