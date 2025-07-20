"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface ThemeContextType {
  theme: "light" | "dark"
  isAutoMode: boolean
  toggleTheme: () => void
  setAutoMode: (auto: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [isAutoMode, setIsAutoMode] = useState(true)

  // Auto theme based on time
  useEffect(() => {
    if (isAutoMode) {
      const updateTheme = () => {
        const hour = new Date().getHours()
        const isDayTime = hour >= 6 && hour < 18
        setTheme(isDayTime ? "light" : "dark")
      }

      updateTheme()
      const interval = setInterval(updateTheme, 60000) // Check every minute

      return () => clearInterval(interval)
    }
  }, [isAutoMode])

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [theme])

  const toggleTheme = () => {
    if (isAutoMode) {
      setIsAutoMode(false)
    }
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  const setAutoMode = (auto: boolean) => {
    setIsAutoMode(auto)
    if (auto) {
      const hour = new Date().getHours()
      const isDayTime = hour >= 6 && hour < 18
      setTheme(isDayTime ? "light" : "dark")
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, isAutoMode, toggleTheme, setAutoMode }}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
