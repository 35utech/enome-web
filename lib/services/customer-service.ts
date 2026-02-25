import { db } from "@/lib/db";
import { customer } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { CONFIG } from "@/lib/config";
import { produkDetail } from "@/lib/db/schema";

export class CustomerService {
    /**
     * Get customer category ID from user ID.
     * Returns default category ID if not found.
     */
    static async getKategoriId(userId?: number | string | null): Promise<number> {
        if (!userId) return CONFIG.DEFAULT_KATEGORI_CUSTOMER_ID;

        const customerData = await db.select({
            kategoriCustomerId: customer.kategoriCustomerId
        })
            .from(customer)
            .where(eq(customer.userId, Number(userId)))
            .limit(1);

        return customerData[0]?.kategoriCustomerId || CONFIG.DEFAULT_KATEGORI_CUSTOMER_ID;
    }

    /**
     * Get the appropriate price column based on category ID.
     */
    static getPriceColumn(kategoriId: number) {
        const priceColumnName = CONFIG.PRICE_COLUMNS[kategoriId] || CONFIG.PRICE_COLUMNS[CONFIG.DEFAULT_KATEGORI_CUSTOMER_ID];
        return (produkDetail as any)[priceColumnName] || sql.raw(priceColumnName);
    }

    /**
     * Get custId from user ID.
     */
    static async getCustId(userId: number | string): Promise<string | null> {
        const data = await this.getCustomerData(userId);
        return data?.custId || null;
    }

    /**
     * Get full customer data from user ID.
     */
    static async getCustomerData(userId: number | string) {
        const data = await db.select()
            .from(customer)
            .where(eq(customer.userId, Number(userId)))
            .limit(1);

        return data[0] || null;
    }
}
