"use client";

import { useState } from "react";
import { Ruler, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import FallbackImage from "@/components/store/shared/FallbackImage";
import { ASSET_URL } from "@/config/config";

interface SizeGuideProps {
    imageUrl?: string | null;
}

export default function SizeGuide({ imageUrl }: SizeGuideProps) {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    if (!imageUrl) return null;

    const fullImageUrl = `${ASSET_URL}/img/produk_utama/${imageUrl}`;

    const TriggerButton = (
        <button className="text-[11px] font-bold text-neutral-base-400 hover:text-neutral-base-900 underline flex items-center gap-1 transition-colors">
            <Ruler className="w-3 h-3" />
            Panduan ukuran
        </button>
    );

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {TriggerButton}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white border-none shadow-2xl">
                    <DialogHeader className="p-6 border-b border-neutral-base-100">
                        <DialogTitle className="text-lg font-bold text-neutral-base-900 flex items-center gap-2">
                            <Ruler className="w-5 h-5 text-neutral-base-400" />
                            Panduan Ukuran
                        </DialogTitle>
                    </DialogHeader>
                    <div className="relative aspect-square w-full bg-neutral-base-50">
                        <FallbackImage
                            src={fullImageUrl}
                            alt="Size Guide"
                            fill
                            className="object-contain p-4"
                        />
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                {TriggerButton}
            </DrawerTrigger>
            <DrawerContent className="bg-white border-none rounded-t-[32px] overflow-hidden">
                <DrawerHeader className="px-6 pt-8 pb-4 border-b border-neutral-base-50">
                    <DrawerTitle className="text-xl font-bold text-neutral-base-900 flex items-center gap-2">
                        <Ruler className="w-6 h-6 text-neutral-base-400" />
                        Panduan Ukuran
                    </DrawerTitle>
                </DrawerHeader>
                <div className="relative aspect-square w-full bg-neutral-base-50 px-4 py-8">
                    <FallbackImage
                        src={fullImageUrl}
                        alt="Size Guide"
                        fill
                        className="object-contain p-2"
                    />
                </div>
                <DrawerFooter className="p-6">
                    <DrawerClose asChild>
                        <Button variant="outline" className="w-full h-12 rounded-xl font-bold text-neutral-base-600 border-neutral-base-200">
                            Tutup
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
