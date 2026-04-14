import React, { useState } from "react";
import { userApi } from "@/lib/api/user-api";
import { Loader2, Package, MapPin, CheckCircle2, AlertCircle, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

interface TrackingManifestProps {
    awb: string;
    courier: string;
    phone: string;
    showTitle?: boolean;
    isCollapsible?: boolean;
}

export default function TrackingManifest({ awb, courier, phone, showTitle = false, isCollapsible = false }: TrackingManifestProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const { data: trackingResponse, isLoading: loading, error: queryError, refetch } = useQuery({
        queryKey: ["tracking", awb, courier, phone],
        queryFn: () => userApi.trackWaybill(awb, courier, phone),
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!awb,
    });

    const trackingData = trackingResponse?.data;
    const summary = trackingData?.summary;
    const status = trackingData?.status;
    const error = (queryError as any)?.message || (trackingResponse?.meta?.status !== "success" && trackingResponse?.meta?.message) || null;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-base-900" />
                <p className="text-[13px] font-medium text-neutral-base-400">Memuat info pengiriman...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                    <h3 className="text-[15px] font-bold text-neutral-base-900">Oops! Terjadi Masalah</h3>
                    <p className="text-[12px] text-neutral-base-400 mt-1">{error}</p>
                </div>
                <button
                    onClick={() => refetch()}
                    className="text-[12px] font-bold text-neutral-base-900 underline underline-offset-4"
                >
                    Coba Lagi
                </button>
            </div>
        );
    }

    const allManifest = [...(trackingData?.manifest || [])].reverse();
    const itemsToGroup = isCollapsible && !isExpanded ? allManifest.slice(0, 2) : allManifest;
    const hasMore = allManifest.length > 2;
    
    // Grouping logic
    const displayedGroups = itemsToGroup.reduce((groups: any[], item: any) => {
        const date = item.manifest_date;
        let group = groups.find((g: any) => g.date === date);
        if (!group) {
            group = { date, items: [] };
            groups.push(group);
        }
        group.items.push(item);
        return groups;
    }, []);

    const getStatusIcon = (desc: string) => {
        const d = desc.toLowerCase();
        if (d.includes("diterima") || d.includes("delivered") || d.includes("sampai") || d.includes("pod")) 
            return { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100" };
        if (d.includes("manifested") || d.includes("diproses") || d.includes("processing") || d.includes("booked"))
            return { icon: Package, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100" };
        if (d.includes("transit") || d.includes("departed") || d.includes("arrived") || d.includes("dikirim") || d.includes("keberangkatan"))
            return { icon: Truck, color: "text-indigo-500", bg: "bg-indigo-50", border: "border-indigo-100" };
        if (d.includes("kurir") || d.includes("delivery") || d.includes("oleh"))
            return { icon: MapPin, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100" };
        return { icon: MapPin, color: "text-neutral-base-400", bg: "bg-neutral-base-50", border: "border-neutral-base-100" };
    };

    const currentStatus = summary?.status || allManifest[0]?.manifest_description || "Sedang diproses";
    const statusStyle = getStatusIcon(currentStatus);

    return (
        <div className="space-y-8">
            {showTitle && (
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-neutral-base-900 flex items-center justify-center shadow-lg shadow-neutral-base-900/10 shrink-0">
                        <Package className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-[16px] md:text-[18px] font-bold text-neutral-base-900 tracking-tight font-montserrat uppercase tracking-widest">Riwayat Pengiriman</h2>
                    </div>
                </div>
            )}


            {!allManifest || allManifest.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                    <Package className="w-10 h-10 text-neutral-base-100" />
                    <p className="text-[13px] text-neutral-base-400 font-medium">Belum ada data manifest tersedia.</p>
                </div>
            ) : (
                <div className="space-y-10 px-1">
                    {displayedGroups.map((group: any, gIdx: number) => (
                        <div key={gIdx} className="space-y-6">
                            {/* Date Header */}
                            <div className="flex items-center gap-4">
                                <span className="text-[12px] font-black uppercase tracking-[0.2em] text-neutral-base-900 font-montserrat whitespace-nowrap bg-neutral-base-50 px-4 py-1.5 rounded-full">
                                    {group.date}
                                </span>
                                <div className="h-px bg-neutral-base-100 flex-1" />
                            </div>

                            <div className="relative space-y-0 pb-4">
                                {/* Connecting line */}
                                <div className="absolute left-[19px] top-6 bottom-6 w-[2px] bg-neutral-base-50" />

                                {group.items.map((step: any, idx: number) => {
                                    const isLatestInGroup = idx === 0 && gIdx === 0;
                                    const stepStyle = getStatusIcon(step.manifest_description);
                                    
                                    return (
                                        <div key={idx} className="relative pl-12 pb-8 last:pb-0 group">
                                            {/* Timeline Dot */}
                                            <div
                                                className={cn(
                                                    "absolute left-0 top-1 w-10 h-10 rounded-xl flex items-center justify-center z-10 transition-all border-4 border-white shadow-sm",
                                                    isLatestInGroup ? "bg-neutral-base-900 text-white scale-110 shadow-lg" : "bg-neutral-base-50 text-neutral-base-300"
                                                )}
                                            >
                                                {isLatestInGroup ? (
                                                    <stepStyle.icon className="w-5 h-5" />
                                                ) : (
                                                    <stepStyle.icon className="w-4 h-4" />
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className={cn(
                                                "space-y-2.5 transition-all p-5 rounded-2xl border bg-white shadow-xs hover:shadow-md hover:translate-x-1 duration-300",
                                                isLatestInGroup ? "border-neutral-base-900/10 bg-neutral-base-50/30" : "border-neutral-base-100/50"
                                            )}>
                                                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                                                    <p className={cn(
                                                        "text-[14px] md:text-[15px] font-bold leading-relaxed font-montserrat tracking-tight flex-1",
                                                        isLatestInGroup ? "text-neutral-base-900" : "text-neutral-base-700"
                                                    )}>
                                                        {step.manifest_description}
                                                    </p>
                                                    <div className="flex items-center gap-2 bg-neutral-base-50 px-2 py-0.5 rounded-lg shrink-0">
                                                        <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.1em] text-neutral-base-500 font-montserrat">
                                                            {step.manifest_time}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                {step.city_name && (
                                                    <div className="flex items-center gap-2 pt-1 border-t border-dashed border-neutral-base-100 mt-2">
                                                        <MapPin className="w-3.5 h-3.5 text-neutral-base-400" />
                                                        <span className="text-[12px] md:text-[13px] font-bold text-neutral-base-400 font-montserrat tracking-tight lowercase">
                                                            {step.city_name}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {isCollapsible && hasMore && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="w-full py-4 border-2 border-dashed border-neutral-base-100 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] text-neutral-base-500 hover:text-neutral-base-900 hover:border-neutral-base-300 hover:bg-neutral-base-50 transition-all active:scale-[0.98] flex items-center justify-center gap-3 font-montserrat"
                        >
                            {isExpanded ? (
                                <>Tampilkan Lebih Sedikit</>
                            ) : (
                                <>Lihat Semua Riwayat ({allManifest.length})</>
                            )}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
