import { db } from "@/lib/db";
import { activity } from "@/lib/db/schema";
import logger from "@/lib/logger";
import { sql } from "drizzle-orm";

export class ActivityService {
    /**
     * Log an activity to the database.
     * 
     * @param activityName Short name of the activity
     * @param description Detailed description of the activity
     * @param userId ID of the user performing the activity (optional)
     */
    static async log(activityName: string, description: string, userId?: number | string) {
        try {
            const creatorId = userId ? Number(userId) : null;

            logger.debug("Activity Service: Logging attempt", { activityName, creatorId });

            await db.insert(activity).values({
                activity: activityName,
                activityDescription: description,
                createdBy: creatorId,
                createdAt: sql`DATE_ADD(UTC_TIMESTAMP(), INTERVAL 7 HOUR)`,
            });

            logger.info(`Activity Success: ${activityName}`, { creatorId });
        } catch (error: any) {
            logger.error("Activity Service Error: Failed to log activity", {
                error: error.message,
                activityName,
                userId
            });
            // We don't throw here to prevent activity logging from breaking the main flow
        }
    }
}
