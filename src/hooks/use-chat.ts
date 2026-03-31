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
  });

  const useGetMessages = (conversationId: string) => useQuery({
    queryKey: ["chat", "messages", conversationId],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: MessageResponse[] }>(`/chat/${conversationId}/messages`);
      return response.data.data;
    },
    enabled: !!conversationId,
  });

  const createConversation = useMutation({
    mutationFn: async (data: CreateConversationDto) => {
      const response = await apiClient.post("/chat", data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] }),
  });

  const sendMessage = useMutation({
    mutationFn: async ({ conversationId, data }: { conversationId: string, data: SendMessageDto }) => {
      const response = await apiClient.post(`/chat/${conversationId}/messages`, data);
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
