import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: 4,
      }}
    >
      <Typography variant="h1" sx={{ fontWeight: 700, color: "primary.main" }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ mt: 2, mb: 2 }}>
        Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ maxWidth: 400, mb: 3 }}>
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate("/")}>
        Go to Homepage
      </Button>
    </Box>
  );
};

export default NotFound;
