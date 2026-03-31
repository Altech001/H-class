import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { NotificationResponse, RegisterPushTokenDto } from "@/types/api";

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const useGetNotifications = () => useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: NotificationResponse[] }>("/notifications");
      return response.data.data;
    },
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch(`/notifications/${id}/read`);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
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
