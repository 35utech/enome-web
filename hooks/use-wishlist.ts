import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/api-client";

interface WishlistResponse {
    items: string[];
}

interface WishlistToggleResponse {
    action: "added" | "removed";
    produkId: string;
}

const wishlistKeys = {
    all: ["wishlist"] as const,
};

export function useWishlist() {
    return useQuery<WishlistResponse>({
        queryKey: wishlistKeys.all,
        queryFn: () => apiClient<WishlistResponse>("/api/wishlist"),
    });
}

export function useToggleWishlist() {
    const queryClient = useQueryClient();

    return useMutation<WishlistToggleResponse, Error, string>({
        mutationFn: async (produkId: string) => {
            const res = await fetch("/api/wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ produkId }),
            });
            if (!res.ok) throw new Error("Failed to toggle wishlist");
            return res.json();
        },
        onMutate: async (produkId) => {
            // Optimistic update
            await queryClient.cancelQueries({ queryKey: wishlistKeys.all });
            const previous = queryClient.getQueryData<WishlistResponse>(wishlistKeys.all);

            queryClient.setQueryData<WishlistResponse>(wishlistKeys.all, (old) => {
                if (!old) return { items: [produkId] };
                const isWishlisted = old.items.includes(produkId);
                return {
                    items: isWishlisted
                        ? old.items.filter(id => id !== produkId)
                        : [...old.items, produkId],
                };
            });

            return { previous };
        },
        onError: (_err, _produkId, context: any) => {
            // Rollback on error
            if (context?.previous) {
                queryClient.setQueryData(wishlistKeys.all, context.previous);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
        },
    });
}
