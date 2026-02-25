"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function ProductListHeader() {
    const [sortBy, setSortBy] = useState("Terbaru");

    return (
        <div className="flex items-center justify-between py-6 font-sans">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[14px] text-neutral-base-400">
                <Link href="/" className="hover:text-neutral-base-900 transition-colors">Beranda</Link>
                <span>›</span>
                <span className="text-neutral-base-900 font-bold">Katalog</span>
            </nav>

            {/* Sorting */}
            <div className="flex items-center gap-2">
                <span className="text-[14px] text-neutral-base-400">Urutkan:</span>
                <div className="relative group">
                    <button className="flex items-center gap-2 text-[14px] font-bold text-neutral-base-900 hover:text-neutral-base-600 transition-colors">
                        {sortBy}
                        <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-neutral-base-100 shadow-xl rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                        {["Terbaru", "Harga: Rendah ke Tinggi", "Harga: Tinggi ke Rendah", "A-Z"].map((option) => (
                            <button
                                key={option}
                                onClick={() => setSortBy(option)}
                                className="w-full text-left px-4 py-2 text-[13px] hover:bg-neutral-base-50 transition-colors"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
