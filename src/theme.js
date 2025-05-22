import { createTheme } from "@mui/material";
export const theme = createTheme({
  palette: {
    primary: {
      main: "#f5a519",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          margin: "2px 4px",
        },
      },
    },
  },
});
