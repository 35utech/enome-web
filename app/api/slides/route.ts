import { NextResponse } from "next/server";
import { SlideService } from "@/lib/services/slide-service";
import logger from "@/lib/logger";

export async function GET() {
    try {
        const collections = await SlideService.getBatikCollections();
        return NextResponse.json({
            success: true,
            data: collections
        });
    } catch (error: any) {
        logger.error("API GET /api/slides: Error fetching slides", { error: error.message });
        return NextResponse.json({
            success: false,
            error: "Failed to fetch slides"
        }, { status: 500 });
    }
}
