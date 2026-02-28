import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-utils";
import logger, { apiLogger } from "@/lib/logger";

/**
 * Mengecek status autentikasi user saat ini.
 * Digunakan frontend (useAuth hook) untuk verifikasi session.
 *
 * @auth optional
 * @method GET
 * @response 200 (authenticated)   — { authenticated: true, user: { id, email, name } }
 * @response 401 (unauthenticated) — { authenticated: false }
 */
export async function GET(request: NextRequest) {
    logger.debug("API Request: GET /api/auth/me");
    try {
        const session = await getSession();

        if (!session) {
            logger.info("Auth Check: Unauthorized /api/auth/me");
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        logger.debug("Auth Check: Success /api/auth/me", { userId: session.user.id });
        return NextResponse.json({
            authenticated: true,
            user: session.user
        });

    } catch (error: any) {
        apiLogger.error(request, error);
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }
}

