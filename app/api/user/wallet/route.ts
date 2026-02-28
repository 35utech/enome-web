import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-utils";
import logger, { apiLogger } from "@/lib/logger";
import { CustomerService } from "@/lib/services/customer-service";
import { UserService } from "@/lib/services/user-service";

/**
 * Mengambil saldo wallet terakhir milik user.
 * Mencari custId lalu mengambil record saldo terbaru dari tabel wallet.
 *
 * @auth required
 * @method GET
 * @response 200 — { balance: number }
 * @response 401 — { message: "login" }
 * @response 500 — { message: "error", error: "Terjadi kesalahan sistem" }
 */
export async function GET() {
    logger.info("API Request: GET /api/user/wallet");
    try {
        const session = await getSession();
        if (!session) {
            logger.warn("Wallet Check: Unauthorized access attempt");
            return NextResponse.json({ message: "login" }, { status: 401 });
        }

        const userId = session.user.id;

        // Mencari custId yang berelasi dengan userId ini
        const custId = await CustomerService.getCustId(userId);

        if (!custId) {
            logger.info("Wallet Check: Customer profile not found, returning 0 balance");
            return NextResponse.json({ balance: 0 });
        }

        const balance = await UserService.getWalletBalance(custId);

        logger.info("Wallet Check: Balance fetched successfully", { userId, balance });
        return NextResponse.json({ balance });
    } catch (error: any) {
        apiLogger.error(null, error, { route: "/api/user/wallet" });
        return NextResponse.json({ message: "error", error: "Terjadi kesalahan sistem" }, { status: 500 });
    }
}

