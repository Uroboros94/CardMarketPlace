import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Listing } from "@/types";

export function useListingsByCard(cardId: number) {
  return useQuery<Listing[]>({
    queryKey: ["listings", "card", cardId],
    queryFn: async () => {
      const { data } = await api.get(`/listings?cardId=${cardId}`);
      return data;
    },
    enabled: !!cardId,
  });
}

export function useCreateListing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Listing>) => api.post("/listings", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["listings"] }),
  });
}
