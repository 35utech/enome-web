import { useQuery } from "@tanstack/react-query";
import { productApi, Product, ProductDetailResponse, Category } from "@/lib/api/product-api";
import { queryKeys } from "@/lib/query-keys";

export type { Product, ProductDetailResponse, Category };

export function useNewArrivals() {
    return useQuery<Product[]>({
        queryKey: queryKeys.products.newArrivals,
        queryFn: productApi.getNewArrivals,
    });
}

export function useProduct(id: string) {
    return useQuery<ProductDetailResponse>({
        queryKey: queryKeys.products.detail(id),
        queryFn: () => productApi.getById(id),
        enabled: !!id,
    });
}

export function useCategories() {
    return useQuery<Category[]>({
        queryKey: queryKeys.categories.all,
        queryFn: productApi.getCategories,
    });
}

export function useProducts() {
    return useQuery<Product[]>({
        queryKey: queryKeys.products.all,
        queryFn: productApi.getAll,
    });
}
