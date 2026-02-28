import { db } from "@/lib/db";
import { size } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import logger, { apiLogger } from "@/lib/logger";

/**
 * Mengambil semua data ukuran dari database.
 *
 * @auth none
 * @method GET
 * @response 200 — { sizeId: string, size: string }[]
 * @response 500 — { error: "Gagal mengambil data ukuran" }
 */
export async function GET() {
    logger.info("API Request: GET /api/sizes");
    try {
        const data = await db.select().from(size);

        logger.info("API Response: 200 /api/sizes", { count: data.length });
        return NextResponse.json(data);
    } catch (error: any) {
        apiLogger.error(null, error, { route: "/api/sizes" });
        return NextResponse.json(
            { error: "Gagal mengambil data ukuran" },
            { status: 500 }
        );
    }
}
