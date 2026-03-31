import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { NoteResponse, CreateNoteDto } from "@/types/api";

export const useNotes = () => {
  const queryClient = useQueryClient();

  const useGetNotesByCourse = (courseId: string) => useQuery({
    queryKey: ["notes", "course", courseId],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: NoteResponse[] }>(`/notes/course/${courseId}`);
      return response.data.data;
    },
    enabled: !!courseId,
  });

  const createNote = useMutation({
    mutationFn: async (data: CreateNoteDto) => {
      const response = await apiClient.post("/notes", data);
      return response.data;
    },
    onSuccess: (_, variables) => queryClient.invalidateQueries({ queryKey: ["notes", "course", variables.courseId] }),
  });

  const getNoteDownloadUrl = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.get<{ success: boolean; data: { downloadUrl: string } }>(`/notes/${id}/download`);
      return response.data.data.downloadUrl;
    },
  });

  return {
    useGetNotesByCourse,
    createNote: createNote.mutateAsync,
    getNoteDownloadUrl: getNoteDownloadUrl.mutateAsync,
  };
};
