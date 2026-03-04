
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface NavOverlayProps {
    setIsSearchOpen: (open: boolean) => void;
    setAuthModal: (modal: { open: boolean; tab: "login" | "register" }) => void;
}

export default function NavOverlay({ setIsSearchOpen, setAuthModal }: NavOverlayProps) {
    const router = useRouter();

    return (
        <div className="absolute top-0 left-0 right-0 z-50 pointer-events-none">
            <div className="flex items-center justify-between gap-4 px-8 py-8 md:px-16 md:py-12">
                {/* Logo Placeholder (to push content to the center/right in a balanced way) */}
                <div className="hidden md:block w-32 shrink-0" />

                <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto justify-end">
                    {/* Search Bar Trigger - Soft Silk Light Glassmorphism */}
                    <motion.div
                        whileHover="hover"
                        initial="initial"
                        onClick={() => setIsSearchOpen(true)}
                        className="group pointer-events-auto relative flex items-center gap-3 bg-white/40 backdrop-blur-3xl border border-white/60 pl-4 pr-4 md:pl-6 md:pr-6 h-12 md:h-14 rounded-2xl cursor-pointer hover:bg-white/60 hover:border-white transition-all duration-700 w-full max-w-[280px] md:max-w-[580px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
                    >
                        {/* Shine Effect */}
                        <motion.div
                            variants={{
                                hover: { x: ["-100%", "200%"] }
                            }}
                            transition={{ duration: 1.8, ease: "easeInOut" }}
                            className="absolute inset-0 w-1/2 h-full bg-linear-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] pointer-events-none"
                        />

                        <Search className="size-4 md:size-5 text-zinc-900 group-hover:text-zinc-500 transition-colors shrink-0" />
                        <span className="text-[12px] md:text-[14px] font-medium text-zinc-900 group-hover:text-zinc-500 transition-colors truncate tracking-widest uppercase">Search collection</span>

                        <div className="ml-auto hidden md:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-zinc-900/5 border border-zinc-900/10">
                            <span className="text-[10px] text-zinc-900 group-hover:text-zinc-500 font-medium">⌘K</span>
                        </div>
                    </motion.div>

                    {/* Signup Button - High Contrast Premium Dark Zinc */}
                    <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push("/register")}
                        className="pointer-events-auto h-12 md:h-14 px-8 md:px-10 rounded-2xl bg-zinc-900 text-white text-[11px] md:text-[12px] font-black uppercase tracking-[0.25em] transition-all duration-500 shadow-[0_12px_40px_rgba(0,0,0,0.12)] shrink-0 border border-zinc-800 cursor-pointer"
                    >
                        Sign Up
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
