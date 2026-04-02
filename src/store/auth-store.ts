import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUserResponse } from "@/types/api";

interface AuthState {
  user: AuthUserResponse | null;
  isAuthenticated: boolean;
  
  setAuth: (user: AuthUserResponse) => void;
  setUser: (user: AuthUserResponse) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setAuth: (user) =>
        set({ user, isAuthenticated: true }),
        
      setUser: (user) =>
        set((state) => ({ ...state, user })),

      logout: () =>
        set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage", // stores state in localStorage by default
      // Optionally restrict which parts to persist
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
