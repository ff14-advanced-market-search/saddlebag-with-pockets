import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { createContext, useContext, useState } from 'react'

enum Theme {
  DARK = 'dark',
  LIGHT = 'light'
}

type ThemeContextType = [Theme | null, Dispatch<SetStateAction<Theme | null>>]

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const prefersDarkMQ = `(prefers-color-scheme: dark)`

const getPreferredTheme = () =>
  window.matchMedia(prefersDarkMQ).matches ? Theme.DARK : Theme.LIGHT

/**
 * Provides a theme context that includes the current theme and a function to update it.
 * @example
 * ({ children }) => { ... }
 * <ThemeContext.Provider value={...}>{children}</ThemeContext.Provider>
 * @param {ReactNode} {children} - React component tree to be wrapped with the theme provider.
 * @returns {JSX.Element} Returns a provider component that supplies the current theme and a function to change it.
 * @description
 *   - Initializes theme state based on the user's preferred theme if available.
 *   - Returns null as the theme if running in a non-browser environment.
 *   - Uses ThemeContext to share theme state across components.
 */
const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme | null>(() => {
    if (typeof window !== 'object') {
      return null
    }
    return getPreferredTheme()
  })

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  )
}

const useTheme = () => {
  const context = useContext(ThemeContext)

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider. Ya noob.')
  }
  return context
}

const clientThemeCode = `
;(() => {
const theme = window.matchMedia(${JSON.stringify(prefersDarkMQ)}).matches ? '${
  Theme.DARK
}' : '${Theme.LIGHT}';
const cl = document.documentElement.classList;
const themeAlreadyApplied = cl.contains('${Theme.DARK}') || cl.contains('${
  Theme.LIGHT
}');
if(!themeAlreadyApplied){
    cl.add(theme);
}
})()`
const EnsureThemeApplied = () => {
  return <script dangerouslySetInnerHTML={{ __html: clientThemeCode }} />
}
export { EnsureThemeApplied, Theme, ThemeProvider, useTheme }
