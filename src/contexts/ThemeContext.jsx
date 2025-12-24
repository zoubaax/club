import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  // Always use dark mode
  const theme = 'dark'

  // Apply dark theme immediately on mount
  useEffect(() => {
    const root = window.document.documentElement
    // Remove light class if present
    root.classList.remove('light')
    // Always add dark class
    root.classList.add('dark')
    // Set the data attribute
    root.setAttribute('data-theme', 'dark')
    // Save to localStorage
    localStorage.setItem('theme', 'dark')
  }, [])

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

