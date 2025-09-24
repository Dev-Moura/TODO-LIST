import { createTheme } from "@mui/material/styles";

const primaryMain = "#006060";
const secondaryMain = "#f5f5f5";

const primaryDark = "#1d1d1d";
const secondaryDark = "#909090";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: primaryMain,
    },
    secondary: {
      main: secondaryMain,
    },
    background: {
      default: "#f5f5f5",
      paper: primaryMain,
    },
    text: {
      primary: primaryMain,
      secondary: primaryMain,
    },
  },
  typography: {
    fontFamily: "Metrophonic, sans-serif",
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: secondaryDark,
    },
    secondary: {
      main: secondaryDark,
    },
    background: {
      default: primaryDark,
      paper: "#363636",
    },
    text: {
      primary: primaryDark,
      secondary: primaryDark,
    },
    typography: {
      fontFamily: "Metrophonic, sans-serif",
    },
  },
});

export default lightTheme;
