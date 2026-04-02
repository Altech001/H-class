import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth-store";

// ─── Base Axios Instance ─────────────────────────────────────────────────────
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? "" : "https://h-class-server.onrender.com");

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/auth`, // Update base URL to match docs (all auth endpoints prefix with /api/auth) - Wait, if it's used for other endpoints it should be /api/v1 or just /api. I will keep it /api/v1 to not break other models unless we're sure. Let's trace it.
  withCredentials: true, // send cookies (access and refresh token are HttpOnly cookies)
  headers: {
    "Content-Type": "application/json",
  },
});

// Since the guide says all endpoints prefix with /api/auth, but there are other entities (courses, users), I'll make baseURL just /api/v1. To match '/api/auth/login' properly we will keep it as before.
apiClient.defaults.baseURL = `${API_BASE_URL}/api/v1`;

// ─── Response Interceptor (Silent Refresh) ───────────────────────────────────
// If a 401 is received, try to refresh the token once, then retry the request.
let isRefreshing = false;
let failedQueue: Array<{
  resolve: () => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Only attempt refresh on 401 and if we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(
          `${API_BASE_URL}/api/v1/auth/refresh`,
          {},
          { withCredentials: true }
        );
        
        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
