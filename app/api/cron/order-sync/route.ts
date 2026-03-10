import { NextRequest, NextResponse } from "next/server";
import { CronService } from "@/lib/services/cron-service";
import logger from "@/lib/logger";

/**
 * Handle GET/POST requests to trigger the cron sync.
 * Usage: GET /api/cron/order-sync?secret=YOUR_CRON_SECRET
 */
export async function GET(req: NextRequest) {
    return handleSync(req);
}

export async function POST(req: NextRequest) {
    return handleSync(req);
}

async function handleSync(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");

    // Security Check: Ensure CRON_SECRET matches if defined
    const expectedSecret = process.env.CRON_SECRET;

    if (expectedSecret && secret !== expectedSecret) {
        logger.warn("Unauthorized cron sync attempt", { ip: req.headers.get("x-forwarded-for") || "unknown" });
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const results = {
            cancelOrders: await CronService.cancelExpiredOrders(),
            closeEvents: await CronService.closeExpiredEvents(),
            syncStock: await CronService.syncProductStock(),
            cleanupCart: await CronService.cleanupExpiredFlashSaleCart(),
        };

        const success = Object.values(results).every(r => r.success);

        return NextResponse.json({
            success,
            results,
            message: success ? "Cron tasks completed successfully" : "Some cron tasks failed"
        }, { status: success ? 200 : 500 });

    } catch (error: any) {
        logger.error("Sync API Error", error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
