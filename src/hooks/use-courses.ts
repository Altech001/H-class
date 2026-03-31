import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { CourseResponse, CreateCourseDto, UpdateCourseDto, ListCoursesDto } from "@/types/api";

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

  const useGetMyEnrollments = () => useQuery({
    queryKey: ["courses", "enrollments"],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: any }>("/courses/my-enrollments");
      return response.data;
    },
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

  const enrollCourse = useMutation({
    mutationFn: async (courseId: string) => {
      // Backend expects an object with paymentType (default: FULL)
      const response = await apiClient.post(`/courses/${courseId}/enroll`, {
        paymentType: "FULL",
      });
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
    updateCourse: updateCourse.mutateAsync,
    enrollCourse: enrollCourse.mutateAsync,
  };
};
