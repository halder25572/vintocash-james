import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AuthUser = {
  id?: number;
  email: string;
  name: string;
  role?: string;
};

interface AuthStore {
  user: AuthUser | null;
  token: string | null;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      login: (user, token) => {
        set({ user, token });
        // Cookie
        setCookie(
          "auth-storage",
          JSON.stringify({ state: { user, token } })
        );
      },

      logout: async () => {
        const token = get().token;
        
        // Call logout API
        if (token) {
          try {
            const API_BASE_URL =
              process.env.NEXT_PUBLIC_API_URL ||
              "https://backend.vintocash.com/api";
            
            await fetch(`${API_BASE_URL}/user-logout`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
          } catch (error) {
            console.error("Logout API error:", error);
          }
        }
        
        // Clear local state regardless of API result
        set({ user: null, token: null });
        deleteCookie("auth-storage");
      },

      isAuthenticated: () => get().user !== null,
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);