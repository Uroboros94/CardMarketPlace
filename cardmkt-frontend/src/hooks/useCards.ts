import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Card, PaginatedResponse } from "@/types";

interface CardFilters {
  game?: string;
  search?: string;
  condition?: string;
  page?: number;
  pageSize?: number;
}

export function useCards(filters: CardFilters = {}) {
  return useQuery<PaginatedResponse<Card>>({
    queryKey: ["cards", filters],
    queryFn: async () => {
      const { data } = await api.get("/cards", { params: filters });
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 min
  });
}

export function useCard(id: number) {
  return useQuery<Card>({
    queryKey: ["card", id],
    queryFn: async () => {
      const { data } = await api.get(`/cards/${id}`);
      return data;
    },
    enabled: !!id,
  });
}
