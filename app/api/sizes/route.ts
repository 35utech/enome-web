import { db } from "@/lib/db";
import { size } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import logger from "@/lib/logger";

/**
 * Handler untuk mengambil semua data ukuran dari database.
 */
export async function GET() {
    logger.info("API Request: GET /api/sizes");
    try {
        const data = await db.select().from(size);

        logger.info("API Response: 200 /api/sizes", { count: data.length });
        return NextResponse.json(data);
    } catch (error: any) {
        logger.error("API Error: 500 /api/sizes", { error: error.message });
        return NextResponse.json(
            { error: "Gagal mengambil data ukuran" },
            { status: 500 }
        );
    }
}
