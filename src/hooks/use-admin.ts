import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { ApplicationResponse, AppConfigResponse, ApplicationActionDto, CreateConfigDto, UpdateConfigDto, DeleteConfigDto, AuditLogQueryDto, FinancialSummaryQueryDto } from "@/types/api";

export const useAdmin = () => {
  const queryClient = useQueryClient();

  // Applications
  const useGetApplications = () => useQuery({
    queryKey: ["admin", "applications"],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: ApplicationResponse[] }>("/admin/applications");
      return response.data.data;
    },
  });

  const approveApplication = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post(`/admin/applications/${id}/approve`);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "applications"] }),
  });

  const denyApplication = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ApplicationActionDto }) => {
      const response = await apiClient.post(`/admin/applications/${id}/deny`, data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "applications"] }),
  });

  // Config
  const useGetConfig = () => useQuery({
    queryKey: ["admin", "config"],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: AppConfigResponse[] }>("/admin/config");
      return response.data.data;
    },
  });

  const createConfig = useMutation({
    mutationFn: async (data: CreateConfigDto) => {
      const response = await apiClient.post("/admin/config", data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "config"] }),
  });

  const updateConfig = useMutation({
    mutationFn: async (data: UpdateConfigDto) => {
      const response = await apiClient.patch("/admin/config", data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "config"] }),
  });

  const deleteConfig = useMutation({
    mutationFn: async (data: DeleteConfigDto) => {
      const response = await apiClient.delete("/admin/config", { data });
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "config"] }),
  });

  // Audit and Financial
  const useGetAuditLogs = (params: AuditLogQueryDto) => useQuery({
    queryKey: ["admin", "audit-logs", params],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: any[], meta: any }>("/admin/audit-logs", { params });
      return response.data;
    },
  });

  const useGetFinancialSummary = (params: FinancialSummaryQueryDto) => useQuery({
    queryKey: ["admin", "financial-summary", params],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: any }>("/admin/financial-summary", { params });
      return response.data.data;
    },
  });

  // Users
  const useGetUsers = (params: any) => useQuery({
    queryKey: ["admin", "users", params],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: any[]; meta: any }>("/user", { params });
      return response.data;
    },
  });

  const updateUserRole = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const response = await apiClient.patch(`/user/${id}/role`, { role });
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
  });

  const updateUser = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiClient.patch(`/user/${id}`, data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
  });

  const deleteUser = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/user/${id}`);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
  });

  const createUser = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post("/user", data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
  });

  return {
    useGetApplications,
    approveApplication: approveApplication.mutateAsync,
    denyApplication: denyApplication.mutateAsync,
    
    useGetConfig,
    createConfig: createConfig.mutateAsync,
    updateConfig: updateConfig.mutateAsync,
    deleteConfig: deleteConfig.mutateAsync,
    
    useGetAuditLogs,
    useGetFinancialSummary,

    useGetUsers,
    createUser: createUser.mutateAsync,
    updateUserRole: updateUserRole.mutateAsync,
    updateUser: updateUser.mutateAsync,
    deleteUser: deleteUser.mutateAsync,
  };
};
