import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { DomainResponse } from "@/types/api";

export const useDomains = () => {
  const queryClient = useQueryClient();

  const useGetMyDomain = () => useQuery({
    queryKey: ["domains", "my"],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: DomainResponse | null }>("/domains/me");
      return response.data.data;
    },
  });

  const requestDomain = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post("/domains");
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["domains", "my"] }),
  });

  return {
    useGetMyDomain,
    requestDomain: requestDomain.mutateAsync,
  };
};
