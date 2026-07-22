"use client"

import { createContext, useContext, useEffect, useState } from "react"
import Script from "next/script"

type Theme = string | undefined

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: undefined,
  setTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(undefined)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("theme")
    if (stored) {
      setThemeState(stored)
    }
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    if (newTheme) {
      localStorage.setItem("theme", newTheme)
      document.documentElement.classList.toggle("dark", newTheme === "dark")
    } else {
      localStorage.removeItem("theme")
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      document.documentElement.classList.toggle("dark", prefersDark)
    }
  }

  return (
    <ThemeContext.Provider value={{ theme: mounted ? theme : undefined, setTheme }}>
      <Script
        id="theme-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            try {
              var t = localStorage.getItem("theme");
              if (t) {
                document.documentElement.classList.add(t);
              } else {
                var p = window.matchMedia("(prefers-color-scheme: dark)").matches;
                if (p) document.documentElement.classList.add("dark");
              }
            } catch(e) {}
          `,
        }}
      />
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
