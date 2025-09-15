import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface ThemeStore {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const applyTheme = (theme: "light" | "dark") => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "system",
      resolvedTheme: "light",
      setTheme: (theme: Theme) => {
        const resolvedTheme = theme === "system" ? getSystemTheme() : theme;
        applyTheme(resolvedTheme);
        set({ theme, resolvedTheme });
      },
      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === "light" ? "dark" : theme === "dark" ? "light" : "light";
        get().setTheme(newTheme);
      },
    }),
    {
      name: "theme-storage",
      // Remove onRehydrateStorage to prevent theme application during hydration
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== "undefined") {
          const resolvedTheme = state.theme === "system" ? getSystemTheme() : state.theme;
          state.resolvedTheme = resolvedTheme;
          // Listen for system theme changes
          const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
          const handleChange = () => {
            if (state.theme === "system") {
              const newResolvedTheme = getSystemTheme();
              applyTheme(newResolvedTheme);
              state.resolvedTheme = newResolvedTheme;
            }
          };
          mediaQuery.addEventListener("change", handleChange);
        }
      },
    },
  ),
);