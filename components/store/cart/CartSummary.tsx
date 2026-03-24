"use client";

import { formatCurrency } from "@/lib/utils";
import { ShoppingBag, ChevronRight, ShieldCheck, Truck, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CartSummaryProps {
    selectedCount: number;
    totalAmount: number;
    onCheckout: () => void;
    isMobileFooter?: boolean;
}

export default function CartSummary({
    selectedCount,
    totalAmount,
    onCheckout,
    isMobileFooter = false
}: CartSummaryProps) {
    if (isMobileFooter) {
        return (
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-neutral-base-100 p-4 pb-6 lg:hidden shadow-[0_-8px_40px_rgba(0,0,0,0.08)] animate-in slide-in-from-bottom duration-500">
                <div className="max-w-[600px] mx-auto flex items-center justify-between gap-6">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-bold text-neutral-base-400 uppercase tracking-widest leading-none">Total ({selectedCount} Item)</span>
                        <span className="text-[20px] font-bold text-neutral-base-900 tracking-tighter leading-none tabular-nums mt-1">
                            {formatCurrency(totalAmount)}
                        </span>
                    </div>
                    <button
                        onClick={onCheckout}
                        disabled={selectedCount === 0}
                        className="bg-neutral-base-900 text-white px-8 h-12 rounded-xl text-[12px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:bg-neutral-base-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group whitespace-nowrap min-w-[140px] shadow-lg shadow-neutral-base-900/10"
                    >
                        Checkout
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </div>
        );
    }


    return (
        <aside className="w-full lg:w-[380px] lg:sticky lg:top-28 shrink-0">
            <div className="bg-white border border-neutral-base-100 rounded-[24px] md:rounded-[32px] p-5 md:p-8 shadow-xl shadow-neutral-base-400/5">
                <div className="flex items-center gap-3 mb-6 md:mb-8">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-amber-50 flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 text-amber-800" />
                    </div>
                    <h3 className="font-heading text-[18px] md:text-[24px] font-bold text-neutral-base-900 tracking-tight">Ringkasan</h3>
                </div>

                <div className="flex flex-col gap-4 md:gap-5 mb-8">
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] md:text-[11px] font-bold text-neutral-base-400 uppercase tracking-[0.15em]">Subtotal ({selectedCount} item)</span>
                        <span className="text-[13px] md:text-[14px] font-bold text-neutral-base-900 tabular-nums">
                            {formatCurrency(totalAmount)}
                        </span>
                    </div>
                    <div className="h-px bg-neutral-base-50 mx-1" />
                    <div className="flex flex-col gap-2 px-1">
                        <div className="flex justify-between items-end">
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-base-900">Total Tagihan</span>
                            <span className="text-[20px] font-bold text-neutral-base-900 tracking-tighter leading-none tabular-nums">
                                {formatCurrency(totalAmount)}
                            </span>
                        </div>
                        <p className="text-[9px] text-neutral-base-400 font-bold italic text-right">*Belum termasuk ongkir</p>
                    </div>
                </div>

                <button
                    onClick={onCheckout}
                    disabled={selectedCount === 0}
                    className="w-full bg-neutral-base-900 text-white h-13 md:h-16 rounded-[20px] text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-neutral-base-800 transition-all shadow-2xl shadow-neutral-base-900/10 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group px-6"
                >
                    Checkout Sekarang
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="pt-6 border-t border-neutral-base-50 flex items-center justify-around">
                    <Link
                        href="/products"
                        className="mt-6 flex items-center justify-center gap-2 text-neutral-base-400 hover:text-neutral-base-900 transition-all"
                    >
                        <ArrowLeft className="w-3 h-3" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Lanjut Belanja</span>
                    </Link>
                </div>
            </div>
        </aside>
    );
}
