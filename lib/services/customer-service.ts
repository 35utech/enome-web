import { db } from "@/lib/db";
import { customer, customerAlamat } from "@/lib/db/schema";
import { eq, sql, like, notLike, and, desc } from "drizzle-orm";
import { CONFIG } from "@/lib/config";
import { produkDetail } from "@/lib/db/schema";
import { getJakartaDate } from "@/lib/date-utils";
import logger from "@/lib/logger";
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

    /**
     * Logic for generating legacy-compatible cust_id
     */
    static async getNextCustId(): Promise<string> {
        const lastCustomer = await db.select({ custId: customer.custId })
            .from(customer)
            .where(
                and(
                    like(customer.custId, 'C%'),
                    notLike(customer.custId, 'CUST-%')
                )
            )
            .orderBy(desc(customer.custId))
            .limit(1);

        const key = "C";
        const padding = 10;
        const lastId = lastCustomer.length > 0 ? lastCustomer[0].custId : `${key}${"0".repeat(padding)}`;

        const lastNum = parseInt(lastId.substring(key.length)) || 0;
        const nextNum = lastNum + 1;
        const nextId = key + nextNum.toString().padStart(padding, "0");

        return nextId;
    }

    /**
     * Ensures a customer record exists for the given user.
     * If not found, it creates one using the provided name and email.
     */
    static async ensureCustomerData(userId: number | string, name: string, email: string) {
        const existing = await this.getCustomerData(userId);
        if (existing) return existing;

        logger.info("CustomerService: Auto-provisioning missing customer record", { userId, email });

        const custId = await this.getNextCustId();

        await db.insert(customer).values({
            custId,
            namaCustomer: name,
            userId: Number(userId),
            email: email,
            kategoriCustomerId: CONFIG.DEFAULT_KATEGORI_CUSTOMER_ID,
            completedDepositTime: getJakartaDate(),
            isDeleted: 0,
        });

        // Also create a default primary address record if none exists
        // This is usually done in register, but for provisioned users we should ensure they have at least one entry point
        // However, the Address API will likely create one anyway. 
        // We just return the new customer object here.

        const newCustomer = await this.getCustomerData(userId);
        return newCustomer;
    }
}
