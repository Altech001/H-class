import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { AssessmentResponse, SubmissionResponse, CreateAssessmentDto, SubmitAssessmentDto, GradeSubmissionDto } from "@/types/api";

export const useAssessments = () => {
  const queryClient = useQueryClient();

  const useGetAssessmentsByCourse = (courseId: string) => useQuery({
    queryKey: ["assessments", "course", courseId],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: AssessmentResponse[] }>(`/assessments/course/${courseId}`);
      return response.data.data;
    },
    enabled: !!courseId,
  });

  const useGetAssessment = (id: string) => useQuery({
    queryKey: ["assessments", id],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: AssessmentResponse }>(`/assessments/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
  
  const useGetSubmissions = (assessmentId: string) => useQuery({
    queryKey: ["assessments", assessmentId, "submissions"],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: SubmissionResponse[] }>(`/assessments/${assessmentId}/submissions`);
      return response.data.data;
    },
    enabled: !!assessmentId,
  });

  const createAssessment = useMutation({
    mutationFn: async (data: CreateAssessmentDto) => {
      const response = await apiClient.post("/assessments", data);
      return response.data;
    },
    onSuccess: (_, variables) => queryClient.invalidateQueries({ queryKey: ["assessments", "course", variables.courseId] }),
  });

  const submitAssessment = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: SubmitAssessmentDto }) => {
      const response = await apiClient.post(`/assessments/${id}/submit`, data);
      return response.data;
    },
  });

  const gradeSubmission = useMutation({
    mutationFn: async ({ submissionId, data }: { submissionId: string, data: GradeSubmissionDto }) => {
      const response = await apiClient.post(`/assessments/submissions/${submissionId}/grade`, data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["assessments"] }),
  });

  return {
    useGetAssessmentsByCourse,
    useGetAssessment,
    useGetSubmissions,
    createAssessment: createAssessment.mutateAsync,
    submitAssessment: submitAssessment.mutateAsync,
    gradeSubmission: gradeSubmission.mutateAsync,
  };
};
