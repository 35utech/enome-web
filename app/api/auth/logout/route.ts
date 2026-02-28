import { NextRequest, NextResponse } from "next/server";
import { logout } from "@/lib/auth-utils";
import logger, { apiLogger } from "@/lib/logger";

/**
 * Logout user — menghapus session/cookie.
 *
 * @auth required
 * @method POST
 * @response 200 — { message: "Logout berhasil" }
 * @response 500 — { error: "Terjadi kesalahan sistem" }
 */
export async function POST(request: NextRequest) {
    logger.info("API Request: POST /api/auth/logout");
    try {
        await logout();
        logger.info("Auth Success: User logged out");
        return NextResponse.json({ message: "Logout berhasil" });
    } catch (error: any) {
        apiLogger.error(request, error);
        return NextResponse.json({ error: "Terjadi kesalahan sistem" }, { status: 500 });
    }
}

