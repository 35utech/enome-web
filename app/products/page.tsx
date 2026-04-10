import { Suspense } from "react";
import { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export const metadata: Metadata = {
    title: "Jelajahi Produk",
};
import { ProductService } from "@/lib/services/product-service";
import { CategoryService } from "@/lib/services/category-service";
import { CustomerService } from "@/lib/services/customer-service";
import { queryKeys } from "@/lib/query-keys";
import { eq, sql } from "drizzle-orm";
import { produk } from "@/lib/db/schema";
import { getSession } from "@/lib/auth-utils";
import CONFIG from "@/lib/config";
import ProductsClient from "@/components/store/product/ProductsClient";
import ProductListSkeleton from "@/components/store/product/ProductListSkeleton";

export default async function ProductsPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await props.searchParams;

    return (
        <Suspense fallback={<ProductListSkeleton />}>
            <ProductsContent searchParams={searchParams} />
        </Suspense>
    );
}

async function ProductsContent({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const queryClient = new QueryClient();

    // 1. Get User Session & Category for Price Calculation
    const session = await getSession();
    const kategoriId = session?.user?.id 
        ? await CustomerService.getKategoriId(session.user.id)
        : CONFIG.DEFAULT_KATEGORI_CUSTOMER_ID;

    // 2. Parse Filters from URL
    const filters = {
        collection: typeof searchParams.category === "string" ? searchParams.category.split(",") : [],
        size: typeof searchParams.size === "string" ? searchParams.size.split(",") : [],
        color: typeof searchParams.color === "string" ? searchParams.color.split(",") : [],
        brand: typeof searchParams.brand === "string" ? searchParams.brand.split(",") : [],
        gender: typeof searchParams.gender === "string" ? searchParams.gender.split(",") : [],
        price: typeof searchParams.price === "string" ? searchParams.price.split(",") : [],
        search: typeof searchParams.search === "string" ? searchParams.search : undefined,
    };

    // 3. Prefetch Data in Parallel
    // Initial load: 1 page (9 items)
    const initialParams = {
        ...filters,
        page: 1,
        limit: CONFIG.PAGINATION.DEFAULT_LIMIT,
        sort: "newest"
    };

    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: [...queryKeys.products.all, initialParams],
            queryFn: () => ProductService.getProducts({
                kategoriId,
                categories: filters.collection,
                sizes: filters.size,
                colors: filters.color,
                brand: filters.brand,
                gender: filters.gender,
                priceRanges: filters.price,
                search: filters.search,
                page: 1,
                limit: CONFIG.PAGINATION.DEFAULT_LIMIT,
                orderBy: sql`${produk.tglRilis} DESC, ${produk.produkId} DESC`, // matching "newest" sort
                where: eq(produk.isOnline, 1),
            }),
        }),
        queryClient.prefetchQuery({
            queryKey: [...queryKeys.categories.all, { brand: filters.brand, gender: filters.gender }, undefined],
            queryFn: () => CategoryService.getCategories({
                brand: filters.brand,
                gender: filters.gender,
            }),
        }),
        queryClient.prefetchQuery({
            queryKey: queryKeys.colors.all,
            queryFn: () => ProductService.getColors(),
        }),
        queryClient.prefetchQuery({
            queryKey: queryKeys.sizes.all,
            queryFn: () => ProductService.getSizes(),
        }),
    ]);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductsClient />
        </HydrationBoundary>
    );
}


