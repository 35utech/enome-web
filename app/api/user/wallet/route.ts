import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-utils";
import logger from "@/lib/logger";
import { CustomerService } from "@/lib/services/customer-service";
import { UserService } from "@/lib/services/user-service";

/**
 * Handler untuk mendapatkan saldo wallet terakhir milik user.
 * Mencari custId terlebih dahulu lalu mengambil record saldo terbaru dari tabel wallet.
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
        logger.error("API Error: /api/user/wallet", { error: error.message });
        return NextResponse.json({ message: "error", error: error.message }, { status: 500 });
    }
}

