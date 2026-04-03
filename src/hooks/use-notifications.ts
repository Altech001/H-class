import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { NotificationResponse, RegisterPushTokenDto } from "@/types/api";

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const useGetNotifications = (params?: { page?: number; pageSize?: number }) => useQuery({
    queryKey: ["notifications", params],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: NotificationResponse[] }>("/notifications", { params });
      return response.data;
    },
    refetchInterval: 30000, // Poll notifications every 30s
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch<{ success: boolean; data: NotificationResponse }>(`/notifications/${id}/read`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const registerPushToken = useMutation({
    mutationFn: async (data: RegisterPushTokenDto) => {
      const response = await apiClient.post("/notifications/push-tokens", data);
      return response.data;
    },
  });

  return {
    useGetNotifications,
    markAsRead: markAsRead.mutateAsync,
    registerPushToken: registerPushToken.mutateAsync,
  };
};
