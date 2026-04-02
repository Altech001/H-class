import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { CourseResponse, CreateCourseDto, UpdateCourseDto, ListCoursesDto } from "@/types/api";

interface EnrollDto {
  phoneNumber: string;
  paymentType?: "FULL" | "PARTIAL";
}

interface PayBalanceDto {
  phoneNumber: string;
}

export const useCourses = () => {
  const queryClient = useQueryClient();

  const useGetCourses = (params?: ListCoursesDto) => useQuery({
    queryKey: ["courses", params],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: any }>("/courses", { params });
      return response.data;
    },
  });

  const useGetCourse = (id: string) => useQuery({
    queryKey: ["courses", id],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: CourseResponse }>(`/courses/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });

  const useGetMyEnrollments = (options?: { refetchInterval?: number }) => useQuery({
    queryKey: ["courses", "enrollments"],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: any }>("/courses/my-enrollments");
      return response.data;
    },
    refetchInterval: options?.refetchInterval,
  });

  const createCourse = useMutation({
    mutationFn: async (data: CreateCourseDto) => {
      const response = await apiClient.post("/courses", data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["courses"] }),
  });

  const updateCourse = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCourseDto }) => {
      const response = await apiClient.patch(`/courses/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["courses", variables.id] });
    },
  });

  const publishCourse = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post(`/courses/${id}/publish`);
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["courses", id] });
    },
  });

  const completeCourse = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post(`/courses/${id}/complete`);
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["courses", id] });
    },
  });

  const archiveCourse = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post(`/courses/${id}/archive`);
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["courses", id] });
    },
  });

  const enrollCourse = useMutation({
    mutationFn: async ({ courseId, data }: { courseId: string; data: EnrollDto }) => {
      const response = await apiClient.post(`/courses/${courseId}/enroll`, data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["courses", "enrollments"] }),
  });

  const payBalance = useMutation({
    mutationFn: async ({ courseId, data }: { courseId: string; data: PayBalanceDto }) => {
      const response = await apiClient.post(`/courses/${courseId}/pay-balance`, data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["courses", "enrollments"] }),
  });

  const useGetCourseStudents = (courseId: string, params?: { page?: number; pageSize?: number }) => useQuery({
    queryKey: ["courses", courseId, "students", params],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: any }>(`/courses/${courseId}/students`, { params });
      return response.data;
    },
    enabled: !!courseId,
  });

  return {
    useGetCourses,
    useGetCourse,
    useGetCourseStudents,
    useGetMyEnrollments,
    createCourse: createCourse.mutateAsync,
    isCreatingCourse: createCourse.isPending,
    updateCourse: updateCourse.mutateAsync,
    isUpdatingCourse: updateCourse.isPending,
    publishCourse: publishCourse.mutateAsync,
    isPublishingCourse: publishCourse.isPending,
    completeCourse: completeCourse.mutateAsync,
    isCompletingCourse: completeCourse.isPending,
    archiveCourse: archiveCourse.mutateAsync,
    isArchivingCourse: archiveCourse.isPending,
    enrollCourse: enrollCourse.mutateAsync,
    isEnrollingCourse: enrollCourse.isPending,
    payBalance: payBalance.mutateAsync,
    isPayingBalance: payBalance.isPending,
  };
};
