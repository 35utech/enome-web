"use client";

import React, { useState, useEffect } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { userApi } from "@/lib/api/user-api";
import { Spinner } from "@/components/ui/spinner";
import { Truck, MapPin, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { id } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";

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
    const [loading, setLoading] = useState(true);
    const [trackingData, setTrackingData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && awb && courier) {
            fetchTracking();
        }
    }, [isOpen, awb, courier]);

    const fetchTracking = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await userApi.trackWaybill(awb, courier, phone);
            // Komerce v1 structure: { meta: { code: 200 }, data: { summary: {...}, manifest: [...] } }
            if (response.meta?.code === 200 && response.data) {
                setTrackingData(response.data);
            } else {
                setError(response.meta?.message || response.message || "Gagal mengambil data pelacakan.");
            }
        } catch (err: any) {
            setError("Terjadi kesalahan saat menghubungi server.");
        } finally {
            setLoading(false);
        }
    };

    const TrackingContent = () => (
        <div className="bg-[#F9FAFB] p-1">
            <ScrollArea className={cn("px-8 py-4", isMobile ? "h-[70vh]" : "h-[600px]")}>
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center py-20 space-y-4">
                        <Spinner className="w-8 h-8 text-neutral-base-900" />
                        <p className="text-sm font-bold text-neutral-base-400 animate-pulse">Menghubungkan ke kurir...</p>
                    </div>
                ) : error ? (
                    <div className="py-20 flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center">
                            <AlertCircle className="w-8 h-8 text-rose-500" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-neutral-base-900 italic">Ups! Data Belum Tersedia</p>
                            <p className="text-sm text-neutral-base-400 mt-1 max-w-[280px]">
                                {error}
                            </p>
                        </div>
                        <button
                            onClick={fetchTracking}
                            className="mt-4 px-6 py-2 bg-white border border-neutral-base-100 rounded-xl text-xs font-bold hover:bg-white/50 transition-all"
                        >
                            Coba Lagi
                        </button>
                    </div>
                ) : trackingData ? (
                    <div className="space-y-8 pb-8">
                        {/* Summary Section */}
                        <div className="bg-white p-6 rounded-3xl border border-neutral-base-100 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center justify-between mb-4">
                                <span className={cn(
                                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                                    trackingData.summary?.status?.toUpperCase() === "DELIVERED"
                                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                        : "bg-blue-50 text-blue-600 border border-blue-100"
                                )}>
                                    {trackingData.summary?.status || "In Transit"}
                                </span>
                                <span className="text-[12px] font-bold text-neutral-base-400 uppercase">
                                    {trackingData.summary?.courier_name || courier}
                                </span>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-neutral-base-50 flex items-center justify-center shrink-0">
                                        <MapPin className="w-4 h-4 text-neutral-base-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-neutral-base-300 uppercase tracking-tight">Penerima</p>
                                        <p className="text-sm font-bold text-neutral-base-900">{trackingData.summary?.receiver_name || "-"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* History Section (Manifest) */}
                        <div className="relative pl-6 space-y-10 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-neutral-base-100/50">
                            {[...(trackingData.manifest || [])].reverse().map((event: any, idx: number) => {
                                const isLast = idx === 0;
                                return (
                                    <div key={idx} className="relative">
                                        <div className={cn(
                                            "absolute -left-8 top-1 w-6 h-6 rounded-full border-4 border-[#F9FAFB] flex items-center justify-center transition-all z-10",
                                            isLast ? "bg-neutral-base-900 scale-125 shadow-lg shadow-neutral-base-900/20" : "bg-neutral-base-200"
                                        )}>
                                            {isLast ? (
                                                <CheckCircle2 className="w-3 h-3 text-white" />
                                            ) : (
                                                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                            )}
                                        </div>
                                        <div className={cn(
                                            "transition-all duration-300",
                                            isLast ? "opacity-100 translate-x-1" : "opacity-60"
                                        )}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Clock className="w-3.5 h-3.5 text-neutral-base-300" />
                                                <p className="text-[11px] font-bold text-neutral-base-400">
                                                    {event.manifest_date} {event.manifest_time}
                                                </p>
                                            </div>
                                            <p className={cn(
                                                "text-[14px] font-bold leading-relaxed",
                                                isLast ? "text-neutral-base-900" : "text-neutral-base-500"
                                            )}>
                                                {event.manifest_description}
                                            </p>
                                            {event.city_name && (
                                                <p className="text-[11px] font-medium text-neutral-base-400 mt-2 flex items-center gap-1.5 italic">
                                                    <MapPin className="w-3 h-3" />
                                                    {event.city_name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : null}
            </ScrollArea>
        </div>
    );

    if (isMobile) {
        return (
            <Drawer open={isOpen} onOpenChange={onClose}>
                <DrawerContent className="rounded-t-[32px] border-none">
                    <DrawerHeader className="px-8 pt-8 pb-4">
                        <DrawerTitle className="text-2xl font-black text-neutral-base-900 flex items-center gap-3">
                            <Truck className="w-6 h-6" />
                            Lacak Pesanan
                        </DrawerTitle>
                        <DrawerDescription className="text-neutral-base-400 font-medium text-left">
                            Resi: <span className="text-neutral-base-900 font-bold">{awb}</span> ({courier.toUpperCase()})
                        </DrawerDescription>
                    </DrawerHeader>
                    <TrackingContent />
                    <div className="p-6 bg-white border-t border-neutral-base-50">
                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-neutral-base-900 text-white rounded-2xl text-[14px] font-bold hover:opacity-90 transition-all"
                        >
                            Tutup
                        </button>
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden rounded-[32px] border-none shadow-2xl">
                <DialogHeader className="p-8 pb-4 bg-white">
                    <DialogTitle className="text-2xl font-black text-neutral-base-900 flex items-center gap-3">
                        <Truck className="w-6 h-6" />
                        Lacak Pesanan
                    </DialogTitle>
                    <DialogDescription className="text-neutral-base-400 font-medium">
                        Resi: <span className="text-neutral-base-900 font-bold">{awb}</span> ({courier.toUpperCase()})
                    </DialogDescription>
                </DialogHeader>

                <TrackingContent />

                <div className="p-6 bg-white border-t border-neutral-base-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-neutral-base-900 text-white rounded-2xl text-[13px] font-bold hover:opacity-90 transition-all"
                    >
                        Tutup
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
