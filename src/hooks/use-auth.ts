import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import type { LoginDto, RegisterDto, LoginResult } from "@/types/api";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { setAuth, logout } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginDto) => {
      const response = await apiClient.post<{ success: boolean; data: LoginResult }>("/auth/login", credentials);
      return response.data.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      // Invalidate queries dependent on auth state
      queryClient.invalidateQueries();
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterDto) => {
      const response = await apiClient.post("/auth/register", data);
      return response.data;
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post("/auth/logout");
    },
    onSettled: () => {
      logout();
      queryClient.clear();
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post("/auth/change-password", data);
      return response.data;
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
  });

  return {
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,

    changePassword: changePasswordMutation.mutateAsync,
    isChangingPassword: changePasswordMutation.isPending,
  };
};
