"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronRight, Search, ShoppingBag, Heart, Settings, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    Command,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { useHighlights, useProducts } from "@/hooks/use-products";
import { useDebounce } from "@/hooks/use-debounce";
import { ASSET_URL } from "@/config/config";

interface Collection {
    id: string;
    title: string;
    images: {
        url: string;
        aspect: string;
    }[];
}

const SearchMenuContent = ({
    setDirection,
    setCurrentIndex,
    currentIndex,
    setIsSearchOpen,
    router,
    collections,
    products,
    searchQuery
}: {
    setDirection: (dir: number) => void;
    setCurrentIndex: (idx: number) => void;
    currentIndex: number;
    setIsSearchOpen: (open: boolean) => void;
    router: any;
    collections: Collection[];
    products: any[];
    searchQuery: string;
}) => (
    <CommandList className="scrollbar-hide max-h-none pb-12">
        <CommandEmpty className="py-24 flex flex-col items-center justify-center gap-6">
            <div className="size-20 rounded-3xl bg-zinc-50 border border-zinc-100 flex items-center justify-center animate-pulse">
                <Search className="size-8 text-zinc-200" />
            </div>
            <div className="text-center space-y-2">
                <p className="text-zinc-900 text-lg font-semibold tracking-wide">No results found</p>
                <p className="text-zinc-400 text-sm">Try searching for "Batik", "Silk", or "Collection"</p>
            </div>
        </CommandEmpty>

        {collections.length > 0 && (
            <CommandGroup
                heading={
                    <div className="flex items-center gap-3 px-6 md:px-10 pt-8 pb-4">
                        <Sparkles className="size-3 text-zinc-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Featured Collections</span>
                    </div>
                }
            >
                <div className="px-5 md:px-8 space-y-2">
                    {collections.map((collection) => (
                        <CommandItem
                            key={collection.id}
                            onSelect={() => {
                                const index = collections.findIndex(c => c.id === collection.id);
                                if (index !== -1) {
                                    setDirection(index > currentIndex ? 1 : -1);
                                    setCurrentIndex(index);
                                    setIsSearchOpen(false);
                                }
                            }}
                            className="group/item flex items-center gap-5 px-4 py-4 rounded-2xl bg-zinc-50/0 hover:bg-zinc-50 data-[selected=true]:bg-zinc-100/60 cursor-pointer transition-all duration-300 border border-transparent hover:border-zinc-200/50"
                        >
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-50 shrink-0 shadow-lg">
                                <Image
                                    src={collection.images[0].url}
                                    alt={collection.title}
                                    fill
                                    className="object-cover group-hover/item:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <div className="flex flex-col gap-1 overflow-hidden min-w-0">
                                <span className="font-bold text-[15px] md:text-[16px] text-zinc-900 tracking-wide truncate">{collection.title}</span>
                                <span className="text-[12px] text-zinc-400 uppercase tracking-widest font-medium">{collection.images.length} masterworks</span>
                            </div>
                            <div className="ml-auto flex items-center gap-2 opacity-0 group-hover/item:opacity-100 transition-all transform translate-x-4 group-hover/item:translate-x-0">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">View Gallery</span>
                                <ChevronRight className="size-4 text-zinc-300" />
                            </div>
                        </CommandItem>
                    ))}
                </div>
            </CommandGroup>
        )}

        <div className="mt-8 mb-4 h-px bg-zinc-100 mx-8 md:mx-12" />

        <CommandGroup
            heading={
                <div className="flex items-center gap-3 px-6 md:px-10 pt-4 pb-4">
                    <ShoppingBag className="size-3 text-zinc-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
                        {searchQuery ? "Search Results" : "Rekomendasi Produk"}
                    </span>
                </div>
            }
        >
            <div className="px-5 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-3">
                {products.map((product) => (
                    <CommandItem
                        key={product.produkId}
                        onSelect={() => {
                            router.push(`/products/${product.produkId}`);
                            setIsSearchOpen(false);
                        }}
                        className="group/prod flex items-center gap-4 px-4 py-4 rounded-2xl bg-zinc-50/0 hover:bg-zinc-50 data-[selected=true]:bg-zinc-100/60 cursor-pointer transition-all duration-300 border border-transparent hover:border-zinc-200/50"
                    >
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-50 shrink-0 shadow-sm border border-zinc-100">
                            <Image
                                src={`${ASSET_URL}/img/produk_utama/${product.gambar}` || "/placeholder.png"}
                                alt={product.namaProduk}
                                fill
                                className="object-cover group-hover/prod:scale-110 transition-transform duration-700"
                            />
                        </div>
                        <div className="flex flex-col gap-0.5 overflow-hidden min-w-0">
                            <span className="font-semibold text-[14px] text-zinc-900 truncate">{product.namaProduk}</span>
                            <span className="text-[11px] text-zinc-400 uppercase tracking-widest font-medium mb-1">{product.kategori}</span>
                            <span className="text-[14px] text-zinc-900 font-bold tracking-tight">
                                {product.finalMinPrice ? `Rp ${Number(product.finalMinPrice).toLocaleString('id-ID')}` : "Contact for Price"}
                            </span>
                        </div>
                    </CommandItem>
                ))}
            </div>
        </CommandGroup>

        <div className="mt-8 mb-4 h-px bg-zinc-100 mx-8 md:mx-12" />

        {/* <CommandGroup
            heading={
                <div className="px-6 md:px-10 pt-4 pb-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Quick Navigation</span>
                </div>
            }
        >
            <div className="flex flex-wrap gap-3 px-6 md:px-10">
                {[
                    { name: "Archive", path: "/products", icon: ShoppingBag },
                    { name: "Favorites", path: "/account/wishlist", icon: Heart },
                    { name: "Concierge", path: "/faq", icon: Settings },
                ].map((action) => (
                    <button
                        key={action.name}
                        onClick={() => {
                            router.push(action.path);
                            setIsSearchOpen(false);
                        }}
                        className="flex items-center gap-3 px-6 py-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-100 hover:border-zinc-200 text-[12px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-all active:scale-95 group"
                    >
                        <action.icon className="size-4 group-hover:scale-110 transition-transform" />
                        {action.name}
                    </button>
                ))}
            </div>
        </CommandGroup> */}
    </CommandList>
);

interface SearchModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    isMobile: boolean;
    setDirection: (dir: number) => void;
    setCurrentIndex: (idx: number) => void;
    currentIndex: number;
    router: any;
    collections: Collection[];
}

export default function SearchModal({
    isOpen,
    onOpenChange,
    isMobile,
    setDirection,
    setCurrentIndex,
    currentIndex,
    router,
    collections
}: SearchModalProps) {
    const [searchValue, setSearchValue] = useState("");
    const debouncedSearch = useDebounce(searchValue, 300);

    const { data: highlights = [] } = useHighlights();
    const { data: searchResults = [] } = useProducts({ search: debouncedSearch });

    const displayedProducts = debouncedSearch ? searchResults : highlights;
    if (isMobile) {
        return (
            <Drawer open={isOpen} onOpenChange={onOpenChange}>
                <DrawerContent className="bg-white border-zinc-100 text-zinc-900 rounded-t-[40px] h-[92vh] border-t p-0 overflow-hidden shadow-2xl">
                    <DrawerHeader className="sr-only">
                        <DrawerTitle>Explore Enome</DrawerTitle>
                    </DrawerHeader>

                    <div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-zinc-100" />

                    <Command className="bg-transparent flex flex-col h-full overflow-hidden">
                        <div className="relative px-6 py-6 shrink-0">
                            <div className="absolute left-10 top-1/2 -translate-y-1/2">
                                <Search className="size-5 text-zinc-300" />
                            </div>
                            <CommandInput
                                placeholder="Search collection, product..."
                                value={searchValue}
                                onValueChange={setSearchValue}
                                className="h-16 text-lg bg-zinc-50 rounded-3xl border-none focus:ring-0 placeholder:text-zinc-300 text-zinc-900 font-medium pl-14 pr-6 w-full"
                            />
                        </div>
                        <ScrollArea className="flex-1 px-2">
                            <SearchMenuContent
                                setDirection={setDirection}
                                setCurrentIndex={setCurrentIndex}
                                currentIndex={currentIndex}
                                setIsSearchOpen={onOpenChange}
                                router={router}
                                collections={collections}
                                products={displayedProducts}
                                searchQuery={searchValue}
                            />
                        </ScrollArea>
                    </Command>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <CommandDialog
            open={isOpen}
            onOpenChange={onOpenChange}
            className="bg-white/95 backdrop-blur-3xl border border-white text-zinc-900 rounded-[40px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] max-w-3xl"
            commandClassName="bg-transparent"
        >
            <div className="relative px-10 py-10 flex items-center gap-6">
                <div className="flex-1 relative">
                    {/* <div className="absolute left-0 top-1/2 -translate-y-1/2">
                        <Search className="size-6 text-zinc-300" />
                    </div> */}
                    <CommandInput
                        placeholder="SEARCH THE COLLECTION..."
                        value={searchValue}
                        onValueChange={setSearchValue}
                        className="h-16 text-md border-none focus:ring-0 placeholder:text-zinc-200 text-zinc-900 font-black pl-10 pr-0 tracking-widest uppercase bg-transparent w-full"
                    />
                </div>
                {/* <button
                    onClick={() => onOpenChange(false)}
                    className="size-12 rounded-full bg-zinc-50 flex items-center justify-center hover:bg-zinc-100 transition-colors shrink-0 group"
                >
                    <X className="size-5 text-zinc-400 group-hover:text-zinc-900 group-hover:rotate-90 transition-all duration-500" />
                </button> */}
            </div>

            <ScrollArea className="h-[600px] scrollbar-hide">
                <SearchMenuContent
                    setDirection={setDirection}
                    setCurrentIndex={setCurrentIndex}
                    currentIndex={currentIndex}
                    setIsSearchOpen={onOpenChange}
                    router={router}
                    collections={collections}
                    products={displayedProducts}
                    searchQuery={searchValue}
                />
            </ScrollArea>

            <div className="px-10 py-6 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                {/* <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 rounded bg-zinc-200/50 text-[10px] font-bold text-zinc-500">ESC</kbd>
                        <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">to close</span>
                    </div>
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-300 font-black">Enome Luxury Experience</div> */}
            </div>
        </CommandDialog>
    );
}
