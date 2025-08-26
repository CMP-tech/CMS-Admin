// theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light", // or "dark"
    primary: {
      main: "#1976d2", // Blue
      contrastText: "#ffffff", // Text on primary buttons
    },
    secondary: {
      main: "#9c27b0", // Purple
      contrastText: "#ffffff",
    },
    background: {
      default: "#f5f5f5", // Page background
      paper: "#ffffff", // Cards/dialog background
    },
    text: {
      primary: "#212121", // Visible black text
      secondary: "#616161",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          fontWeight: 600,
          textTransform: "none",
        },
      },
    },
  },
});

export default theme;
