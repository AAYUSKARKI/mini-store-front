"use client"

import * as React from "react"
import { useThemeStore } from "@/store/themeStore"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const setTheme = useThemeStore((state) => state.setTheme)

  React.useEffect(() => {
    // Initialize theme on mount
    const stored = localStorage.getItem("theme-storage")
    if (stored) {
      try {
        const { state } = JSON.parse(stored)
        setTheme(state.theme || "system")
      } catch {
        setTheme("system")
      }
    } else {
      setTheme("system")
    }
  }, [setTheme])

  return <>{children}</>
}
