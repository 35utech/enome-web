"use client";

import { useQuery } from "@tanstack/react-query";
import { checkoutApi } from "@/lib/api/checkout-api";

export function useConfig(keys: string[]) {
    return useQuery({
        queryKey: ["config", keys.sort().join(",")],
        queryFn: () => checkoutApi.getConfig(keys),
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
    });
}

export function useSoldOutLabel() {
    const { data: config } = useConfig(["label_sold_out"]);
    return config?.label_sold_out || "Sold Out";
}
