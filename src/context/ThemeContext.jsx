/**
 * Theme context — provides the current color mode (light/dark) and persists
 * the user's choice in `localStorage`.
 */

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { lightTheme, darkTheme } from "../theme/theme";

/** Storage key for the persisted color mode. @type {string} */
const THEME_STORAGE_KEY = "listo_theme";

/**
 * @typedef {Object} ThemeContextValue
 * @property {"light"|"dark"} mode - Active color mode.
 * @property {() => void} toggleMode - Switches between light and dark.
 */

/** React context holding the theme state. */
const ThemeContext = createContext(null);

/**
 * Reads the initial color mode from storage, falling back to the OS setting.
 * @returns {"light"|"dark"} The resolved color mode.
 */
function getInitialMode() {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* storage unavailable */
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Wraps the app with the active MUI theme and exposes {@link ThemeContextValue}.
 *
 * @param {Object} props - Component props.
 * @param {import("react").ReactNode} props.children - App subtree.
 * @returns {JSX.Element} The themed provider tree.
 */
export function ThemeProviderWrapper({ children }) {
  const [mode, setMode] = useState(getInitialMode);

  // Persist whenever the user flips the switch.
  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      /* storage unavailable */
    }
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      toggleMode: () => setMode((m) => (m === "light" ? "dark" : "light")),
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={mode === "light" ? lightTheme : darkTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

/**
 * Accesses the current color mode and its toggle function.
 * @returns {ThemeContextValue} `{ mode, toggleMode }`.
 * @throws {Error} When used outside of {@link ThemeProviderWrapper}.
 */
export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useAppTheme must be used within ThemeProviderWrapper");
  return ctx;
}
