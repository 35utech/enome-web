import { apiClient } from "./api-client";

export interface Category {
    kategoriId: number;
    kategori: string;
}

export interface Product {
    produkId: string;
    kategori: string;
    namaProduk: string;
    qtyStokNormal?: number | null;
    qtyStokRijek?: number | null;
    tglRilis: string | null;
    gambar: string | null;
    gambarSize?: string | null;
    deskripsi?: string | null;
    detail?: string | null;
    createdAt?: number | null;
    updatedAt?: number | null;
    isOnline: number;
    tglOnline?: string | null;
    isAktif: number;
    produkPreorder?: number;
    customerKategoriId?: string | null;
    customerPerson?: string | null;
    isHighlighted: number;
    highlightedAt?: string | null;
    highlightOrder?: number | null;
    minPrice: string | null;
    colors: string | null;
    totalStock?: number | null;
}

export interface ProductDetailResponse {
    product: Product;
    stats: {
        minPrice: string;
        maxPrice: string;
        totalStock: string;
    };
    variants: {
        colors: { name: string; value: string; image: string | null; totalStock: number }[];
        sizes: string[];
        matrix: { color: string; size: string; stock: number; price: string; image: string | null }[];
    };
    images: string[];
    relatedProducts: any[];
}

export const productApi = {
    getAll: () => apiClient<Product[]>("/api/products"),
    getNewArrivals: () => apiClient<Product[]>("/api/products/new-arrivals"),
    getById: (id: string) => apiClient<ProductDetailResponse>(`/api/products/${id}`),
    getCategories: () => apiClient<Category[]>("/api/categories"),
};
