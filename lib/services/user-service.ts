import { db } from "@/lib/db";
import { customerAlamat, wallet } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export class UserService {
    /**
     * Get customer addresses.
     */
    static async getAddresses(custId: string) {
        const legacyAddresses = await db.select({
            id: customerAlamat.id,
            customerId: customerAlamat.custId,
            name: customerAlamat.namaPenerima,
            address: customerAlamat.alamatLengkap,
            phone: customerAlamat.noHandphone,
            label: customerAlamat.labelAlamat,
            kelurahan: customerAlamat.kelurahan,
            kecamatan: customerAlamat.kecamatan,
            kota: customerAlamat.kota,
            provinsi: customerAlamat.provinsi,
            kodePos: customerAlamat.kodePos,
            namaToko: customerAlamat.namaToko,
            isPrimary: customerAlamat.isPrimary,
        })
            .from(customerAlamat)
            .where(eq(customerAlamat.custId, custId))
            .orderBy(desc(customerAlamat.id));

        return legacyAddresses.map(addr => ({
            id: addr.id,
            label: addr.label || "Alamat",
            receiverName: addr.name || "",
            phoneNumber: addr.phone || "",
            fullAddress: addr.address || "",
            city: addr.kota || "",
            province: addr.provinsi || "",
            district: addr.kecamatan || "",
            postalCode: addr.kodePos || "",
            shopName: addr.namaToko || "",
            isPrimary: addr.isPrimary,
            type: addr.isPrimary === 1 ? "Utama" : "Alamat Tersimpan"
        }));
    }

    /**
     * Get wallet balance.
     */
    static async getWalletBalance(custId: string): Promise<number> {
        const [lastWallet]: any = await db.select()
            .from(wallet)
            .where(eq(wallet.custId, custId))
            .orderBy(desc(wallet.id))
            .limit(1);

        return lastWallet?.saldo || 0;
    }
}
