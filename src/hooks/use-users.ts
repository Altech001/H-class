import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { UpdateProfileDto, UserProfileResponse } from "@/types/api";

export const useUsers = () => {
  const queryClient = useQueryClient();

  const useGetProfile = () => useQuery({
    queryKey: ["user", "profile"],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: UserProfileResponse }>("/users/me");
      return response.data.data;
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (data: UpdateProfileDto) => {
      const response = await apiClient.patch("/users/me", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
  });

  const deleteAccount = useMutation({
    mutationFn: async () => {
      await apiClient.delete("/users/me");
    },
    onSuccess: () => {
      queryClient.clear();
      // Auth store logout will likely need to be triggered from UI after this mutation
    },
  });

  return {
    useGetProfile,
    updateProfile: updateProfile.mutateAsync,
    deleteAccount: deleteAccount.mutateAsync,
  };
};
