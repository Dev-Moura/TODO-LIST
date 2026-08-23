/**
 * Application themes (light and dark) following a Material You / Google
 * Tasks inspired palette: neutral surfaces, generous rounding and the classic
 * Google blue accent.
 */

import { createTheme } from "@mui/material/styles";

/** Base font stack (Roboto loaded via Google Fonts in index.html). */
const FONT_FAMILY = '"Roboto", "Helvetica", "Arial", sans-serif';

/**
 * Light theme — soft gray background with white cards.
 * Mirrors Google's light app surfaces (#f8fafd canvas, white cards).
 */
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1a73e8" },
    success: { main: "#188038" },
    error: { main: "#d93025" },
    warning: { main: "#f9ab00" },
    background: { default: "#f8fafd", paper: "#ffffff" },
    text: { primary: "#1f1f1f", secondary: "#444746" },
    divider: "#dadce0",
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: FONT_FAMILY,
    h4: { fontWeight: 400 },
    h5: { fontWeight: 500 },
  },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiButton: { defaultProps: { disableElevation: true } },
  },
});

/**
 * Dark theme — deep charcoal surfaces matching Google's dark apps.
 * Note: `typography` lives at the theme root (the previous version had it
 * accidentally nested inside `palette`, which MUI ignores).
 */
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#8ab4f8" },
    success: { main: "#81c995" },
    error: { main: "#f28b82" },
    warning: { main: "#fdd663" },
    background: { default: "#131314", paper: "#1e1f20" },
    text: { primary: "#e3e3e3", secondary: "#9aa0a6" },
    divider: "#3c4043",
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: FONT_FAMILY,
    h4: { fontWeight: 400 },
    h5: { fontWeight: 500 },
  },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiButton: { defaultProps: { disableElevation: true } },
  },
});
