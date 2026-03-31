import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { UploadUrlDto, UploadUrlResult } from "@/types/api";
import axios from "axios";

export const useMedia = () => {

  const getUploadUrl = useMutation({
    mutationFn: async (data: UploadUrlDto) => {
      const response = await apiClient.post<{ success: boolean; data: UploadUrlResult }>("/media/upload-url", data);
      return response.data.data;
    },
  });

  const uploadFileToS3 = useMutation({
    mutationFn: async ({ url, file, onProgress }: { url: string; file: File; onProgress?: (p: number) => void }) => {
      await axios.put(url, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentCompleted);
          }
        },
      });
    },
  });

  // Helper method combining url generation and actual upload
  const uploadFile = async (prefix: string, file: File, onProgress?: (p: number) => void) => {
    const { uploadUrl, key } = await getUploadUrl.mutateAsync({
      prefix,
      fileName: file.name,
      contentType: file.type,
    });
    
    await uploadFileToS3.mutateAsync({ url: uploadUrl, file, onProgress });
    
    return { key };
  };

  return {
    getUploadUrl: getUploadUrl.mutateAsync,
    uploadFileToS3: uploadFileToS3.mutateAsync,
    uploadFile,
    isGeneratingUrl: getUploadUrl.isPending,
    isUploading: uploadFileToS3.isPending,
  };
};
