"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useOrderDetail } from "@/hooks/use-order-detail";
import SuccessState from "@/components/store/checkout/SuccessState";
import { formatCurrency } from "@/lib/utils";
import Navbar from "@/components/store/layout/Navbar";
import { Loader2 } from "lucide-react";

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get("orderId");

    const { data: detail, isLoading, isError } = useOrderDetail(orderId || "");

    if (!orderId) {
        router.push("/");
        return null;
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-neutral-base-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-amber-800" />
                    <p className="text-[14px] font-bold text-neutral-base-400 uppercase tracking-widest">Memuat Detail Pesanan...</p>
                </div>
            </div>
        );
    }

    if (isError || !detail) {
        return (
            <div className="min-h-screen bg-neutral-base-50 flex items-center justify-center">
                <div className="text-center px-4">
                    <h1 className="text-2xl font-bold text-neutral-base-900 mb-2">Pesanan Tidak Ditemukan</h1>
                    <p className="text-neutral-base-500 mb-6">Maaf, kami tidak dapat menemukan detail pesanan dengan ID tersebut.</p>
                    <button 
                        onClick={() => router.push("/")}
                        className="px-8 h-12 bg-neutral-base-900 text-white rounded-xl font-bold"
                    >
                        Kembali ke Beranda
                    </button>
                </div>
            </div>
        );
    }

    // Map OrderDetail to SuccessState props format
    const orderResult = {
        orderId: detail.order.orderId,
        total: detail.order.totalTagihan,
        paymentMethod: detail.order.metodebayar,
        uniqueCode: detail.uniqueCode,
        bankAccount: detail.paymentInfo?.noRekening,
        bankOwner: detail.paymentInfo?.namaPemilik,
        bankName: detail.paymentInfo?.namaBank,
        subtotal: detail.order.totalHarga,
        shippingPrice: detail.order.ongkir,
        packingFee: detail.order.biayalain,
        voucherDiscount: detail.voucherInfo?.nominal,
        walletDeduction: detail.order.viaWallet,
        customerName: detail.order.namaPenerima,
        customerPhone: detail.order.teleponPenerima,
        fullAddress: detail.order.alamatKirim,
        courierName: detail.order.ekspedisi,
        courierService: detail.order.service,
        expiredTime: detail.expiredTime,
        whatsappAdmin: detail.whatsappAdmin,
        statusOrder: detail.order.statusOrder,
        paymentVerificationTimeout: detail.paymentVerificationTimeout,
    };

    return (
        <div className="min-h-screen bg-neutral-base-50">
            <Navbar />
            <SuccessState 
                orderResult={orderResult}
                lastOrderedItems={detail.items}
                formatPrice={formatCurrency}
            />
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-neutral-base-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-amber-800/20" />
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
