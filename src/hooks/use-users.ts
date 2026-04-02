import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import type { UpdateProfileDto, UserProfileResponse } from "@/types/api";

export const useUsers = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  const useGetProfile = () => useQuery({
    queryKey: ["user", "profile"],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: UserProfileResponse }>("/users/me");
      const profile = response.data.data;
      
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
          // Keep auth store synced with latest profile data where they overlap
          setUser({
              ...currentUser,
              firstName: profile.firstName,
              lastName: profile.lastName,
              avatarUrl: profile.avatarUrl,
              role: profile.role,
          });
      }

      return profile;
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (data: UpdateProfileDto) => {
      const response = await apiClient.patch<{ success: boolean; data: UserProfileResponse }>("/users/me", data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      
      if (data?.data) {
        // Sync auth store upon successful update
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
            setUser({
                ...currentUser,
                firstName: data.data.firstName,
                lastName: data.data.lastName,
                avatarUrl: data.data.avatarUrl,
            });
        }
      }
    },
  });

  const deleteAccount = useMutation({
    mutationFn: async () => {
      await apiClient.delete("/users/me");
    },
    onSuccess: () => {
      queryClient.clear();
      logout();
    },
  });

  return {
    useGetProfile,
    updateProfile: updateProfile.mutateAsync,
    deleteAccount: deleteAccount.mutateAsync,
  };
};
