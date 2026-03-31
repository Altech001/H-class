import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { CertificateResponse } from "@/types/api";

export const useCertificates = () => {
  const useGetMyCertificates = () => useQuery({
    queryKey: ["certificates", "my"],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: CertificateResponse[] }>("/certificates/my");
      return response.data.data;
    },
  });

  const useGetCertificate = (id: string) => useQuery({
    queryKey: ["certificates", id],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: CertificateResponse }>(`/certificates/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });

  return {
    useGetMyCertificates,
    useGetCertificate,
  };
};
