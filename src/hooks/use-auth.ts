import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import type { LoginDto, RegisterDto, AuthUserResponse } from "@/types/api";

interface LoginResponse {
  success: boolean;
  user: AuthUserResponse;
  message: string;
}

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { setAuth, logout } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginDto) => {
      const response = await apiClient.post<LoginResponse>("/auth/login", credentials);
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.user);
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

  const verifyEmailMutation = useMutation({
    mutationFn: async (data: { email: string; otp: string }) => {
      const response = await apiClient.post("/auth/verify-email", data);
      return response.data;
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await apiClient.post("/auth/forgot-password", data);
      return response.data;
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { email: string; otp: string; newPassword: string }) => {
      const response = await apiClient.post("/auth/reset-password", data);
      return response.data;
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await apiClient.post("/auth/resend-otp", data);
      return response.data;
    },
  });

  const tutorApplicationMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post("/auth/tutor-application");
      return response.data;
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

    verifyEmail: verifyEmailMutation.mutateAsync,
    isVerifyingEmail: verifyEmailMutation.isPending,

    forgotPassword: forgotPasswordMutation.mutateAsync,
    isForgottingPassword: forgotPasswordMutation.isPending,

    resetPassword: resetPasswordMutation.mutateAsync,
    isResettingPassword: resetPasswordMutation.isPending,

    resendOtp: resendOtpMutation.mutateAsync,
    isResendingOtp: resendOtpMutation.isPending,

    tutorApplication: tutorApplicationMutation.mutateAsync,
    isApplyingTutor: tutorApplicationMutation.isPending,
  };
};
