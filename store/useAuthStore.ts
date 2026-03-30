import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthStore {
  user: { email: string; name: string } | null;
  login: (email: string, name: string) => void;
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

      login: (email, name) => {
        set({ user: { email, name } });
        // Cookie তেও save করো middleware এর জন্য
        setCookie(
          "auth-storage",
          JSON.stringify({ state: { user: { email, name } } })
        );
      },

      logout: () => {
        set({ user: null });
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