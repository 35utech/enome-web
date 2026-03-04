import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Collection {
    id: string;
    title: string;
}

interface CollectionDotsProps {
    currentIndex: number;
    collections: Collection[];
    setDirection: (direction: number) => void;
    setCurrentIndex: (index: number) => void;
}

export default function CollectionDots({ currentIndex, collections, setDirection, setCurrentIndex }: CollectionDotsProps) {
    return (
        <div className="absolute top-1/2 -translate-y-1/2 right-6 md:right-12 z-50 flex flex-col gap-4">
            {collections.map((collection, idx) => (
                <div key={collection.id || idx} className="group relative flex items-center justify-end">
                    {/* Subtle Tooltip */}
                    <motion.span
                        initial={{ opacity: 0, x: 10 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        className="absolute right-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 whitespace-nowrap pointer-events-none transition-all duration-300"
                    >
                        {collection.title}
                    </motion.span>

                    <button
                        onClick={() => {
                            setDirection(idx > currentIndex ? 1 : -1);
                            setCurrentIndex(idx);
                        }}
                        className="relative p-2"
                    >
                        <motion.div
                            animate={{
                                height: currentIndex === idx ? 32 : 6,
                                backgroundColor: currentIndex === idx ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.2)",
                                boxShadow: currentIndex === idx ? "0 0 15px rgba(255, 255, 255, 0.5)" : "none"
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="w-[2px] rounded-full"
                        />
                    </button>
                </div>
            ))}
        </div>
    );
}
