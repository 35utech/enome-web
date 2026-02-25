"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Shirt, Box, Watch, ChevronDown, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const categoryIcons: Record<string, any> = {
    "Kemeja": Shirt,
    "Outer": Box,
    "Aksesori": Watch,
    "Man": Shirt,
    "Table runner": Box,
    "Dress": Shirt,
    "Scarf": Watch,
    "Kids": Shirt,
    "Bags": Box,
};

const sizes = ["S", "M", "L", "XL"];
const colors = [
    { name: "Navy", value: "#1A1B2D" },
    { name: "White", value: "#FFFFFF" },
    { name: "Tan", value: "#D2B48C" },
    { name: "Olive", value: "#808000" },
];

const priceRanges = [
    "Under Rp 500k", "Rp 500k - Rp 1.5M", "Above Rp 1.5M"
];

const subCategories = ["Lengan Panjang", "Outer", "Oversized Fit", "New Edition"];

export interface FilterState {
    size: string[];
    color: string[];
    price: string[];
    collection: string[];
    tag: string[];
}

interface FilterSidebarProps {
    activeFilters: FilterState;
    onFilterChange: (category: keyof FilterState, value: string) => void;
    className?: string;
    collections?: string[];
}

export default function FilterSidebar({ activeFilters, onFilterChange, className, collections: dynamicCollections }: FilterSidebarProps) {
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        collection: true,
        subCategory: true,
        price: true,
        color: true,
        size: false,
        tag: false
    });

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const SectionTitle = ({ title }: { title: string }) => (
        <h3 className="text-[12px] font-bold tracking-[0.05em] uppercase text-neutral-base-400 mb-6 italic">
            {title}
        </h3>
    );

    return (
        <aside className={cn("w-full shrink-0 font-sans pr-8", className)}>
            <div className="space-y-12">
                {/* Categories */}
                <div>
                    <SectionTitle title="Kategori" />
                    <div className="space-y-2">
                        {(dynamicCollections || ["Kemeja", "Outer", "Aksesori"]).map((cat) => {
                            const Icon = categoryIcons[cat] || Box;
                            const isActive = activeFilters.collection.includes(cat);
                            return (
                                <button
                                    key={cat}
                                    onClick={() => onFilterChange("collection", cat)}
                                    className={cn(
                                        "flex items-center gap-4 w-full px-6 py-4 rounded-xl transition-all text-[14px] font-medium",
                                        isActive
                                            ? "bg-blue-50 text-blue-600 shadow-sm"
                                            : "text-neutral-base-500 hover:bg-neutral-base-50"
                                    )}
                                >
                                    <Icon className={cn("w-5 h-5", isActive ? "text-blue-600" : "text-neutral-base-400")} strokeWidth={1.5} />
                                    {cat}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Sub-Kategori */}
                <div>
                    <SectionTitle title="Sub-Kategori" />
                    <div className="space-y-4 px-2">
                        {subCategories.map((sub) => (
                            <label key={sub} className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input type="checkbox" className="sr-only p-2" />
                                    <div className="w-5 h-5 border-2 border-neutral-base-200 rounded-md group-hover:border-blue-600 transition-colors" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-10 transition-opacity">
                                        <Check className="w-3 h-3 text-blue-600" strokeWidth={4} />
                                    </div>
                                </div>
                                <span className="text-[14px] text-neutral-base-600 font-medium group-hover:text-blue-600 transition-colors">{sub}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Price Range */}
                <div>
                    <SectionTitle title="Rentang Harga (Rp)" />
                    <div className="px-2">
                        <div className="h-1 w-full bg-neutral-base-100 rounded-full relative mb-6">
                            <div className="absolute left-0 right-0 h-full bg-blue-100 rounded-full" />
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-blue-600 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-md" />
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-blue-600 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-md" />
                        </div>
                        <div className="flex justify-between items-center text-[13px] font-bold text-neutral-base-900">
                            <span>100.000</span>
                            <span>2.000.000</span>
                        </div>
                    </div>
                </div>

                {/* Color */}
                <div>
                    <SectionTitle title="Warna" />
                    <div className="flex flex-wrap gap-3 px-2">
                        {colors.map((color) => {
                            const isActive = activeFilters.color.includes(color.name);
                            return (
                                <button
                                    key={color.name}
                                    onClick={() => onFilterChange("color", color.name)}
                                    className={cn(
                                        "w-8 h-8 rounded-full border-2 transition-all shadow-sm ring-offset-2",
                                        isActive ? "ring-2 ring-blue-600 scale-110" : "border-neutral-base-100 hover:scale-110"
                                    )}
                                    style={{ backgroundColor: color.value }}
                                    title={color.name}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </aside>
    );
}
