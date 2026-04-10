"use client";

import { m, AnimatePresence } from "framer-motion";
import { Loader2, MapPin, Package, X, Plus, Search } from "lucide-react";
import { Address, useAddresses } from "@/hooks/use-addresses";
import { useState } from "react";
import AddressCard from "./AddressCard";
import SearchInput from "../shared/SearchInput";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerClose,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

interface AddressSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (address: Address) => void;
    onAddNew?: () => void;
}

export default function AddressSelectionModal({
    isOpen,
    onClose,
    onSelect,
    onAddNew
}: AddressSelectionModalProps) {
    const { addresses, isLoading, setPrimary } = useAddresses();
    const isMobile = useIsMobile();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredAddresses = addresses.filter(addr =>
        addr.receiverName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        addr.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        addr.fullAddress?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const Content = () => (
        <>
            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
            <div className="px-6 md:px-10 py-4 border-b border-neutral-base-50 bg-white">
                <SearchInput
                    placeholder="Cari nama atau alamat..."
                    value={searchQuery}
                    onChange={setSearchQuery}
                    className="bg-neutral-base-50/50"
                />
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-6 md:px-10 pb-6 md:pb-10 pt-6 md:pt-8 bg-neutral-base-50/10">
                {isLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-6">
                        <div className="relative">
                            <Loader2 className="w-12 h-12 animate-spin text-amber-800" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-2 h-2 bg-amber-800 rounded-full" />
                            </div>
                        </div>
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-base-300">Memuat Daftar Alamat...</p>
                    </div>
                ) : filteredAddresses.length > 0 || addresses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-20 md:pb-0">
                        <AnimatePresence mode="popLayout">
                            {filteredAddresses.map((addr, idx) => (
                                <m.div
                                    key={addr.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <AddressCard
                                        address={addr}
                                        variant="selection"
                                        isSelectable
                                        onSelect={(a) => {
                                            if (a.isPrimary !== 1) {
                                                setPrimary(a.id);
                                            }
                                            onSelect(a);
                                            onClose();
                                        }}
                                        onSetPrimary={setPrimary}
                                        className="p-5 md:p-6 h-full bg-white shadow-sm border border-neutral-base-100/60"
                                    />
                                </m.div>
                            ))}

                            {onAddNew && (
                                <m.button
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 0.99 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onAddNew}
                                    className="bg-white rounded-[32px] border-2 border-dashed border-neutral-base-100 flex flex-col items-center justify-center p-8 hover:bg-neutral-base-50 hover:border-amber-800/20 transition-all min-h-[200px] gap-4 group"
                                >
                                    <div className="w-12 h-12 rounded-[18px] bg-neutral-base-50 flex items-center justify-center text-neutral-base-300 group-hover:bg-amber-50 group-hover:text-amber-800 transition-colors">
                                        <Plus className="w-6 h-6" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[11px] font-black uppercase tracking-widest text-neutral-base-900 mb-1">Tambah Lokasi Baru</p>
                                        <p className="text-[9px] font-bold text-neutral-base-400">Simpan alamat pengiriman lainnya</p>
                                    </div>
                                </m.button>
                            )}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="py-16 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 rounded-[28px] bg-neutral-base-50 flex items-center justify-center mb-6 border border-dashed border-neutral-base-200">
                            <Package className="w-10 h-10 text-neutral-base-200" />
                        </div>
                        <h4 className="text-[18px] font-bold text-neutral-base-900 mb-2">Belum ada alamat</h4>
                        <p className="text-[14px] font-bold text-neutral-base-400 max-w-[280px] leading-relaxed">
                            Silakan tutup modal ini dan pilih "Tambah Baru" untuk membuat alamat pertama Anda.
                        </p>
                        {onAddNew && (
                            <button
                                onClick={onAddNew}
                                className="mt-6 h-12 bg-neutral-base-900 text-white px-8 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-neutral-base-800 transition-colors shadow-lg shadow-neutral-base-900/10"
                            >
                                Tambah Alamat Sekarang
                            </button>
                        )}
                    </div>
                )}
            </div>
        </>
    );

    const Header = ({ isDialog = false }: { isDialog?: boolean }) => {
        const Title = isDialog ? DialogTitle : DrawerTitle;
        const Description = isDialog ? DialogDescription : DrawerDescription;

        return (
            <div className="flex items-center gap-4 md:gap-5 text-left">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl md:rounded-[22px] bg-linear-to-br from-amber-50 to-orange-50 flex items-center justify-center shadow-sm border border-amber-100/50">
                    <MapPin className="w-6 h-6 md:w-7 md:h-7 text-amber-800" />
                </div>
                <div>
                    <Title asChild>
                        <h2 className="text-[20px] md:text-[24px] font-black tracking-tight text-neutral-base-900 leading-tight">
                            Pilih Alamat
                        </h2>
                    </Title>
                    <Description asChild>
                        <p className="text-[12px] md:text-[13px] font-bold text-neutral-base-400 mt-0.5 md:mt-1">
                            Pilih dari alamat yang pernah Anda gunakan
                        </p>
                    </Description>
                </div>
            </div>
        );
    };

    if (isMobile) {
        return (
            <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <DrawerContent className="h-[90dvh] p-0 bg-white rounded-t-[32px] border-none flex flex-col outline-hidden">
                    <div className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-neutral-base-100 mt-3" />
                    <DrawerHeader className="px-6 py-6 border-b border-neutral-base-50 text-left">
                        <Header />
                    </DrawerHeader>
                    <div className="flex-1 overflow-hidden flex flex-col">
                        <Content />
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="w-full sm:max-w-[800px] h-dvh sm:h-auto sm:max-h-[85vh] p-0 bg-white rounded-none sm:rounded-[32px] md:rounded-[40px] shadow-none sm:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border-none overflow-hidden flex flex-col outline-hidden">
                <DialogHeader className="p-6 md:p-10 pb-0 flex flex-row items-center justify-between shrink-0">
                    <Header isDialog />
                </DialogHeader>
                <div className="flex-1 overflow-hidden flex flex-col">
                    <Content />
                </div>
            </DialogContent>
        </Dialog>
    );
}
