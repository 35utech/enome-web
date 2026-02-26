"use client";

import { use } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";
import ProductGallery from "@/components/store/ProductGallery";
import ProductInfo from "@/components/store/ProductInfo";
import ProductCard from "@/components/store/ProductCard";
import { useProduct } from "@/hooks/use-products";
import { ASSET_URL } from "@/config/config";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = use(props.params);
    const { data: productData, isLoading, error } = useProduct(params.id);

    if (isLoading) {
        return <ProductDetailSkeleton />;
    }

    if (error || !productData) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-serif italic text-neutral-base-900">Product Not Found</h2>
                <p className="text-neutral-base-500">The product you are looking for might have been moved or deleted.</p>
            </div>
        );
    }

    const { product, stats, variants, images, relatedProducts } = productData as any;

    // Map images to full URLs
    const galleryImages = images.map((img: string) => `${ASSET_URL}/img/produk/${img}`);

    const formatPriceRange = (min: any, max: any) => {
        const nMin = parseInt(min);
        const nMax = parseInt(max);
        if (!nMax || nMin === nMax) return `Rp ${nMin.toLocaleString()}`;
        return `Rp ${nMin.toLocaleString()} - Rp ${nMax.toLocaleString()}`;
    };

    // Map product for ProductInfo
    const infoProduct = {
        name: product.namaProduk,
        price: formatPriceRange(stats.finalMinPrice, stats.finalMaxPrice),
        originalPrice: (stats.finalMinPrice !== stats.baseMinPrice || stats.finalMaxPrice !== stats.baseMaxPrice)
            ? formatPriceRange(stats.baseMinPrice, stats.baseMaxPrice)
            : undefined,
        description: product.deskripsi || "No description available.",
        colors: variants.colors,
        sizes: variants.sizes,
        collection: product.kategori,
        detail: product.detail,
        totalStock: stats.totalStock,
        matrix: variants.matrix,
        commission: stats.hasCommission ? formatPriceRange(stats.commissionMin, stats.commissionMax) : undefined,
        hasCommission: stats.hasCommission
    };

    return (
        <TooltipProvider>
            <main className="min-h-screen bg-white">
                <Navbar />

                {/* Breadcrumbs */}
                <div className="border-b border-neutral-base-100 bg-neutral-base-50/50">
                    <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 py-4">
                        <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-neutral-base-400 font-sans">
                            Home <span className="mx-2">/</span> Products <span className="mx-2">/</span> <span className="text-neutral-base-900">{product.namaProduk}</span>
                        </p>
                    </div>
                </div>

                <section className="py-12 md:py-20 lg:py-24">
                    <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
                        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                            {/* Left Side - Image Gallery */}
                            <div className="lg:col-span-7">
                                <ProductGallery
                                    images={galleryImages}
                                    isSoldOut={parseInt(stats.totalStock) === 0}
                                />
                            </div>

                            {/* Right Side - Product Info */}
                            <div className="lg:col-span-5">
                                <ProductInfo product={{ ...infoProduct, id: product.produkId } as any} />
                            </div>

                        </div>
                    </div>
                </section>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <section className="py-20 border-t border-neutral-base-100">
                        <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
                            <div className="mb-12">
                                <h2 className="font-serif text-[32px] text-neutral-base-900 italic">You Might Also Love</h2>
                                <p className="text-neutral-base-500 mt-2">More pieces from the {product.kategori} collection.</p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {relatedProducts.map((p: any, idx: number) => {
                                    const relColorArray = p.colors
                                        ? p.colors.split(",").map((c: string) => {
                                            const [name, value] = c.split("|");
                                            return { name, value };
                                        })
                                        : [];

                                    const mappedRelProduct = {
                                        id: p.produkId,
                                        name: p.namaProduk,
                                        image: p.gambar ? `${ASSET_URL}/img/produk/${p.gambar}` : "/placeholder.jpg",
                                        colors: relColorArray,
                                        price: formatPriceRange(p.finalMinPrice, p.finalMaxPrice),
                                        originalPrice: (p.finalMinPrice !== p.baseMinPrice || p.finalMaxPrice !== p.baseMaxPrice)
                                            ? formatPriceRange(p.baseMinPrice, p.baseMaxPrice)
                                            : undefined,
                                        designer: "Handmade Batik by Énome",
                                        totalStock: p.totalStock
                                    };
                                    return <ProductCard key={p.produkId} product={mappedRelProduct as any} index={idx} />;
                                })}
                            </div>
                        </div>
                    </section>
                )}

                <Footer />
            </main>
        </TooltipProvider>
    );
}
function ProductDetailSkeleton() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <div className="border-b border-neutral-base-100 bg-neutral-base-50/50 py-4">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
                    <Skeleton className="h-4 w-64" />
                </div>
            </div>
            <section className="py-12 md:py-20 lg:py-24">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                        <div className="lg:col-span-7">
                            <Skeleton className="aspect-4/5 w-full rounded-3xl" />
                        </div>
                        <div className="lg:col-span-5 space-y-8">
                            <div className="space-y-4">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-8 w-48" />
                            </div>
                            <div className="space-y-4">
                                <Skeleton className="h-6 w-24" />
                                <div className="flex gap-3">
                                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-12 rounded-full" />)}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Skeleton className="h-6 w-24" />
                                <div className="flex gap-3">
                                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-20 rounded-xl" />)}
                                </div>
                            </div>
                            <Skeleton className="h-16 w-full rounded-2xl" />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
