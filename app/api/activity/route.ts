import { NextRequest, NextResponse } from "next/server";
import { withOptionalAuth } from "@/lib/auth-utils";
import { ActivityService } from "@/lib/services/activity-service";
import { apiLogger } from "@/lib/logger";

/**
 * Handle activity logging from the frontend.
 * 
 * @auth optional
 * @method POST
 * @body {{ activity: string, description: string }}
 */
export const POST = withOptionalAuth(async (request: NextRequest, context: any, session: any) => {
    try {
        const body = await request.json();
        const { activity, description } = body;

        if (!activity) {
            return NextResponse.json({ error: "Activity name is required" }, { status: 400 });
        }

        const userId = session?.user?.id;

        // Log asynchronously to avoid blocking the response
        ActivityService.log(activity, description || "", userId);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        apiLogger.error(request, error, { route: "/api/activity" });
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});
