import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { SessionResponse, CreateSessionDto } from "@/types/api";

export const useSessions = () => {
  const queryClient = useQueryClient();

  const useGetSessionsByCourse = (courseId: string) => useQuery({
    queryKey: ["sessions", "course", courseId],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: SessionResponse[] }>(`/sessions/course/${courseId}`);
      return response.data.data;
    },
    enabled: !!courseId,
  });

  const useGetSession = (id: string) => useQuery({
    queryKey: ["sessions", id],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: SessionResponse }>(`/sessions/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });

  const createSession = useMutation({
    mutationFn: async (data: CreateSessionDto) => {
      const response = await apiClient.post("/sessions", data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sessions", "course", variables.courseId] });
    },
  });

  const joinSession = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post(`/sessions/${id}/join`);
      return response.data;
    },
  });

  const startSession = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post(`/sessions/${id}/start`);
      return response.data;
    },
    onSuccess: (_, id) => queryClient.invalidateQueries({ queryKey: ["sessions", id] }),
  });
  
  const endSession = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post(`/sessions/${id}/end`);
      return response.data;
    },
    onSuccess: (_, id) => queryClient.invalidateQueries({ queryKey: ["sessions", id] }),
  });

  return {
    useGetSessionsByCourse,
    useGetSession,
    createSession: createSession.mutateAsync,
    joinSession: joinSession.mutateAsync,
    startSession: startSession.mutateAsync,
    endSession: endSession.mutateAsync,
  };
};
