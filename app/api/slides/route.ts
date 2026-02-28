import { db } from "@/lib/db";
import { slide } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import logger, { apiLogger } from "@/lib/logger";

/**
 * Mengambil daftar slide (carousel) untuk homepage.
 * Hanya slide kategori 'main_image' yang aktif (publish=1), bukan mobile.
 *
 * @auth none
 * @method GET
 * @response 200 — Slide[] (array of active slide objects)
 * @response 500 — { error: "Internal Server Error" }
 */
export async function GET() {
    logger.debug("API Request: GET /api/slides");
    try {
        const data = await db
            .select()
            .from(slide)
            .where(
                and(
                    eq(slide.publish, 1),
                    eq(slide.kategori, "main_image"),
                    eq(slide.isDeleted, 0),
                    eq(slide.isMobile, 0)
                )
            );

        return NextResponse.json(data);
    } catch (error: any) {
        apiLogger.error(null, error, { route: "/api/slides" });
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

