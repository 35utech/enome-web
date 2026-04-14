"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from "@/components/ui/drawer";
import { Truck, RotateCw, X, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import TrackingManifest from "./TrackingManifest";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface TrackingModalProps {
    isOpen: boolean;
    onClose: () => void;
    awb: string;
    courier: string;
    phone: string;
}

export default function TrackingModal({
    isOpen,
    onClose,
    awb,
    courier,
    phone
}: TrackingModalProps) {
    const isMobile = useIsMobile();
    const queryClient = useQueryClient();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await queryClient.invalidateQueries({ queryKey: ["tracking", awb, courier, phone] });
            toast.success("Info pengiriman diperbarui");
        } catch (error) {
            toast.error("Gagal memperbarui info");
        } finally {
            setTimeout(() => setIsRefreshing(false), 500);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(awb);
        setIsCopied(true);
        toast.success("Nomor resi berhasil disalin");
        setTimeout(() => setIsCopied(false), 2000);
    };

    const TrackingHeader = () => (
        <div className="p-6 md:p-10 pb-6 bg-white shrink-0 relative flex flex-col items-center text-center border-b border-neutral-base-50">
            {/* Action Buttons (Top Corners) */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
                <button
                    onClick={handleRefresh}
                    className={cn(
                        "p-2.5 hover:bg-neutral-base-50 rounded-xl transition-all active:scale-95 border border-transparent hover:border-neutral-base-100 shadow-sm",
                        isRefreshing && "animate-spin"
                    )}
                    title="Perbarui status"
                >
                    <RotateCw className={cn("w-5 h-5", isRefreshing ? "text-neutral-base-900" : "text-neutral-base-400")} />
                </button>
                <button
                    onClick={onClose}
                    className="p-2.5 rounded-xl bg-neutral-base-50 text-neutral-base-400 hover:text-neutral-base-900 hover:bg-neutral-base-100 transition-all border border-transparent active:scale-95"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="w-16 h-16 rounded-[22px] bg-neutral-base-900 flex items-center justify-center shadow-xl shadow-neutral-base-900/10 mb-6 mt-4">
                <Truck className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-[20px] md:text-[24px] font-black text-neutral-base-900 font-montserrat tracking-tight">
                Lacak Pesanan
            </h2>

            <div className="flex flex-col items-center gap-3 mt-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-neutral-base-50 rounded-2xl border border-neutral-base-100/50 group">
                    <p className="text-neutral-base-500 font-bold text-[12px] md:text-[14px] font-montserrat uppercase tracking-widest">
                        {courier} <span className="mx-1.5 opacity-20">|</span> <span className="text-neutral-base-900 font-black">{awb}</span>
                    </p>
                    <button
                        onClick={handleCopy}
                        className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm transition-all text-neutral-base-400 hover:text-neutral-base-900"
                        title="Salin Resi"
                    >
                        {isCopied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                </div>
            </div>
        </div>
    );

    const TrackingBody = () => (
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar bg-[#F9FAFB] px-6 md:px-8 py-5">
            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
            <TrackingManifest
                key={`${awb}-${isRefreshing}`}
                awb={awb}
                courier={courier}
                phone={phone}
            />
        </div>
    );

    const TrackingFooter = () => (
        <div className="p-6 md:p-8 bg-white border-t border-neutral-base-50 flex justify-center shrink-0">
            <button
                onClick={onClose}
                className="w-full sm:w-auto px-12 py-4 bg-neutral-base-900 text-white rounded-2xl text-[13px] font-black uppercase tracking-widest hover:bg-neutral-base-800 transition-all active:scale-[0.98] shadow-lg shadow-neutral-base-900/10 outline-hidden font-montserrat"
            >
                Tutup Halaman
            </button>
        </div>
    );

    if (isMobile) {
        return (
            <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <DrawerContent className="h-[90dvh] flex flex-col p-0 border-none bg-white rounded-t-[32px] outline-hidden">
                    <DrawerHeader className="p-0">
                        <DrawerTitle className="sr-only">Lacak Pesanan</DrawerTitle>
                        <DrawerDescription className="sr-only">Informasi status pengiriman paket Anda</DrawerDescription>
                        <TrackingHeader />
                    </DrawerHeader>
                    <TrackingBody />
                    <TrackingFooter />
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="w-[95dvw] sm:max-w-[700px] max-h-[90dvh] p-0 overflow-hidden rounded-[32px] md:rounded-[40px] border-none shadow-2xl flex flex-col outline-hidden bg-[#F9FAFB]">
                <DialogHeader className="p-0">
                    <DialogTitle className="sr-only">Lacak Pesanan</DialogTitle>
                    <DialogDescription className="sr-only">Informasi status pengiriman paket Anda</DialogDescription>
                    <TrackingHeader />
                </DialogHeader>
                <TrackingBody />
                <TrackingFooter />
            </DialogContent>
        </Dialog>
    );
}
