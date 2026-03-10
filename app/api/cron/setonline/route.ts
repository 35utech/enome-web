import { NextRequest, NextResponse } from "next/server";
import { CronService } from "@/lib/services/cron-service";
import logger from "@/lib/logger";

/**
 * Trigger setOnline cron task.
 * Usage: GET /api/cron/setonline?secret=YOUR_CRON_SECRET
 */
export async function GET(req: NextRequest) {
    return handleTask(req);
}

export async function POST(req: NextRequest) {
    return handleTask(req);
}

async function handleTask(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");
    const expectedSecret = process.env.CRON_SECRET;

    if (expectedSecret && secret !== expectedSecret) {
        logger.warn("Unauthorized cron setonline attempt", { ip: req.headers.get("x-forwarded-for") || "unknown" });
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const result = await CronService.setOnline();
        return NextResponse.json(result, { status: result.success ? 200 : 500 });
    } catch (error: any) {
        logger.error("Cron setonline API Error", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
