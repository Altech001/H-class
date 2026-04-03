import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { ConversationResponse, MessageResponse, CreateConversationDto, SendMessageDto } from "@/types/api";

export const useChat = () => {
  const queryClient = useQueryClient();

  const useGetConversations = () => useQuery({
    queryKey: ["chat", "conversations"],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: ConversationResponse[] }>("/chat");
      return response.data.data;
    },
    refetchInterval: 15000, // Poll conversations every 15s
  });

  const useGetMessages = (conversationId: string, params?: { page?: number; pageSize?: number }) => useQuery({
    queryKey: ["chat", "messages", conversationId, params],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: MessageResponse[] }>(`/chat/${conversationId}/messages`, { params });
      return response.data.data;
    },
    enabled: !!conversationId,
    refetchInterval: 5000, // Poll messages every 5s when active
  });

  const createConversation = useMutation({
    mutationFn: async (data: CreateConversationDto) => {
      const response = await apiClient.post<{ success: boolean; data: ConversationResponse }>("/chat", data);
      return response.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] }),
  });

  const sendMessage = useMutation({
    mutationFn: async ({ conversationId, data }: { conversationId: string, data: SendMessageDto }) => {
      const response = await apiClient.post<{ success: boolean; data: MessageResponse }>(`/chat/${conversationId}/messages`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["chat", "messages", variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] });
    },
  });

  return {
    useGetConversations,
    useGetMessages,
    createConversation: createConversation.mutateAsync,
    sendMessage: sendMessage.mutateAsync,
  };
};
