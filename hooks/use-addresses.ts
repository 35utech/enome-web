import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "./use-auth";
import { userApi, Address } from "@/lib/api/user-api";
import { queryKeys } from "@/lib/query-keys";

export type { Address };

export function useAddresses() {
    const queryClient = useQueryClient();
    const { isAuthenticated } = useAuth();

    const { data: addresses = [], isLoading } = useQuery<Address[]>({
        queryKey: queryKeys.user.addresses,
        queryFn: userApi.getAddresses,
        enabled: isAuthenticated,
    });

    const createMutation = useMutation({
        mutationFn: userApi.createAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.user.addresses });
            toast.success("Alamat berhasil ditambahkan");
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    });

    const updateMutation = useMutation({
        mutationFn: userApi.updateAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.user.addresses });
            toast.success("Alamat berhasil diperbarui");
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: userApi.deleteAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.user.addresses });
            toast.success("Alamat berhasil dihapus");
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    });

    const setPrimaryMutation = useMutation({
        mutationFn: (id: number) => userApi.updateAddress({ id, isPrimary: 1 }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.user.addresses });
            toast.success("Alamat utama berhasil diperbarui");
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    });

    return {
        addresses,
        isLoading,
        createAddress: createMutation.mutateAsync,
        updateAddress: updateMutation.mutateAsync,
        deleteAddress: deleteMutation.mutateAsync,
        setPrimary: setPrimaryMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        isSettingPrimary: setPrimaryMutation.isPending,
    };
}
