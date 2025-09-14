import { createTheme } from "@mui/material/styles";

const primaryMain = "#006060";
const secondaryMain = "#ebcea0";

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
      paper: "#fff",
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
      main: primaryMain,
    },
    secondary: {
      main: secondaryMain,
    },
    background: {
      default: "#121212",
      paper: "#1d1d1d",
    },
    text: {
      primary: "#ffffff",
      secondary: "#f3f3f3",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label.Mui-focused": {
            color: primaryMain,
          },
          "& MuiInput-underline:after": {
            BorderBottomColor: primaryMain,
          },
          "& .MuiOutLinedInput-root: ": {
            "&.Mui-focused fieldset": {
              BorderColor: primaryMain,
            },
          },
        },
      },
    },
  },
});

export default lightTheme;
