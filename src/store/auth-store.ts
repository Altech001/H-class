import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUserResponse } from "@/types/api";

interface AuthState {
  user: AuthUserResponse | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  
  setAuth: (user: AuthUserResponse, accessToken: string) => void;
  setAccessToken: (token: string) => void;
  setUser: (user: AuthUserResponse) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true }),
      
      setAccessToken: (accessToken) =>
        set((state) => ({ ...state, accessToken })),
        
      setUser: (user) =>
        set((state) => ({ ...state, user })),

      logout: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage", // stores state in localStorage by default
      // Optionally restrict which parts to persist
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
