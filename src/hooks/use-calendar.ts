import { apiClient } from "@/lib/api-client";
import type { CalendarEventResponse, CalendarQueryDto } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

export const useCalendar = () => {
  const useGetEvents = (params: CalendarQueryDto) => useQuery({
    queryKey: ["calendar", "events", params],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: CalendarEventResponse[] }>("/calendar/events", { params });
      return response.data.data;
    },
    enabled: !!params.startDate && !!params.endDate,
  });

  const useGetIcalUrl = () => {
    // Generate the URL directly since it might be used in a regular anchor tag or calendar subscription
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "https://h-class-server.onrender.com";
    return `${baseUrl}/api/v1/calendar/export/ical`;
  };  

  return {
    useGetEvents,
    getIcalUrl: useGetIcalUrl(),
  };
};
