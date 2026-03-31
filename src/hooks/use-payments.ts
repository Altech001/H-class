import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { ListTransactionsDto, ConnectOnboardingDto, TransactionResponse } from "@/types/api";

export const usePayments = () => {
  const queryClient = useQueryClient();

  const useGetTransactions = (params?: ListTransactionsDto) => useQuery({
    queryKey: ["payments", "transactions", params],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: TransactionResponse[], meta: any }>("/payments/transactions", { params });
      return response.data;
    },
  });

  const createConnectOnboardingUrl = useMutation({
    mutationFn: async (data: ConnectOnboardingDto) => {
      const response = await apiClient.post("/payments/connect/onboarding", data);
      return response.data;
    },
  });

  return {
    useGetTransactions,
    createConnectOnboardingUrl: createConnectOnboardingUrl.mutateAsync,
  };
};
