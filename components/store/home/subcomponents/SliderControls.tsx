import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SliderControlsProps {
    currentIndex: number;
    totalCollections: number;
    paginate: (direction: number) => void;
}

export default function SliderControls({ currentIndex, totalCollections, paginate }: SliderControlsProps) {
    return (
        <div className="absolute inset-y-0 left-0 right-0 z-40 flex items-center justify-between px-8 md:px-16 pointer-events-none">
            <motion.button
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => paginate(-1)}
                disabled={currentIndex === 0}
                className={cn(
                    "w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-white/[0.03] backdrop-blur-3xl text-white border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all pointer-events-auto shadow-[0_8px_32px_rgba(0,0,0,0.4)] group",
                    currentIndex === 0 && "opacity-0 pointer-events-none"
                )}
            >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5px] group-hover:-translate-x-1 transition-transform" />
            </motion.button>
            <motion.button
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => paginate(1)}
                disabled={currentIndex === totalCollections - 1}
                className={cn(
                    "w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-white/[0.03] backdrop-blur-3xl text-white border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all pointer-events-auto shadow-[0_8px_32px_rgba(0,0,0,0.4)] group",
                    currentIndex === totalCollections - 1 && "opacity-0 pointer-events-none"
                )}
            >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5px] group-hover:translate-x-1 transition-transform" />
            </motion.button>
        </div>
    );
}
