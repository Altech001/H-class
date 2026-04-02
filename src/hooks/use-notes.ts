import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { NoteResponse, CreateNoteDto } from "@/types/api";

interface UploadUrlParams {
  courseId: string;
  contentType: string;
  fileName: string;
}

interface UploadUrlResult {
  uploadUrl: string;
  s3Key: string;
}

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

  const getUploadUrl = useMutation({
    mutationFn: async (data: UploadUrlParams) => {
      const response = await apiClient.post<{ success: boolean; data: UploadUrlResult }>("/notes/upload-url", data);
      return response.data.data;
    },
  });

  const createNote = useMutation({
    mutationFn: async (data: CreateNoteDto) => {
      const response = await apiClient.post("/notes", data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notes", "course", variables.courseId] });
    },
  });

  const getNoteDownloadUrl = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.get<{ success: boolean; data: { downloadUrl: string } }>(`/notes/${id}/download`);
      return response.data.data.downloadUrl;
    },
  });

  return {
    useGetNotesByCourse,
    
    getUploadUrl: getUploadUrl.mutateAsync,
    isGettingUploadUrl: getUploadUrl.isPending,

    createNote: createNote.mutateAsync,
    isCreatingNote: createNote.isPending,

    getNoteDownloadUrl: getNoteDownloadUrl.mutateAsync,
    isGettingDownloadUrl: getNoteDownloadUrl.isPending,
  };
};
