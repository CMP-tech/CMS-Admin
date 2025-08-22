import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#000", // Blue (MUI default blue)
      contrastText: "#ffffff", // White text on blue
    },
    secondary: {
      main: "#000000", // Black
      contrastText: "#ffffff", // White text on black
    },
    background: {
      default: "#f0f2f5", // Light gray background
      paper: "#ffffff", // White cards
    },
    text: {
      primary: "#000000", // Black text
      secondary: "#1976d2", // Blue text
    },
  },
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          margin: "2px 4px",
          "&.Mui-selected": {
            backgroundColor: "#1976d2",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          },
        },
      },
    },
  },
});
