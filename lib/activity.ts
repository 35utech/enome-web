/**
 * Global utility to record user activities from the frontend.
 * This calls the /api/activity endpoint.
 * 
 * @param activity Short name/title of the activity
 * @param description Optional detailed description
 */
export async function recordActivity(activity: string, description: string = "") {
    try {
        // We use fetch directly and don't await/block unless absolutely necessary
        fetch("/api/activity", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ activity, description }),
        }).catch(err => {
            console.error("Failed to record activity:", err);
        });
    } catch (e) {
        // Silently fail to not affect user experience
    }
}
