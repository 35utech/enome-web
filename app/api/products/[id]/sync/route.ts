import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "@/lib/services/product-service";
import { CustomerService } from "@/lib/services/customer-service";
import { getSession } from "@/lib/auth-utils";
import CONFIG from "@/lib/config";

/**
 * API untuk melakukan sinkronisasi data real-time (stok dan harga) produk.
 * Digunakan oleh client-side setelah halaman ISR dimuat.
 */
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        
        const session = await getSession();
        const kategoriId = await CustomerService.getKategoriId(session?.user?.id);
        
        const syncData = await ProductService.getRealtimeSync(id, kategoriId);
        
        if (!syncData) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }
        
        return NextResponse.json(syncData);
    } catch (error) {
        console.error("Sync API Error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
