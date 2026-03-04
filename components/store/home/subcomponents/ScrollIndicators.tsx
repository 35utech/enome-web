import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ArrowUp } from "lucide-react";

interface ScrollIndicatorsProps {
    verticalIndex: number;
    totalImages: number;
    scrollVertical: (direction: number) => void;
}

export default function ScrollIndicators({ verticalIndex, totalImages, scrollVertical }: ScrollIndicatorsProps) {
    return (
        <div className="absolute inset-x-0 bottom-10 z-50 flex flex-col items-center pointer-events-none">
            <AnimatePresence mode="wait">
                {verticalIndex < totalImages - 1 ? (
                    <motion.button
                        key="down"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        onClick={() => scrollVertical(1)}
                        className="flex flex-col items-center gap-3 group pointer-events-auto cursor-pointer"
                    >
                        <span className="text-[11px] font-black text-white tracking-[0.6em] group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                            Scroll Down
                        </span>
                        <motion.div
                            animate={{ y: [0, 6, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        >
                            <ArrowDown className="w-5 h-5 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]" />
                        </motion.div>
                    </motion.button>
                ) : (
                    <motion.button
                        key="up"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        onClick={() => scrollVertical(-verticalIndex)}
                        className="flex flex-col items-center gap-3 group pointer-events-auto cursor-pointer"
                    >
                        <motion.div
                            animate={{ y: [0, -6, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        >
                            <ArrowUp className="w-5 h-5 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]" />
                        </motion.div>
                        <span className="text-[11px] font-black text-white tracking-[0.6em] group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                            Back to Top
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
