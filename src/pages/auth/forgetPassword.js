import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password reset requested for:", email);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
        p: 2,
      }}
    >
      <Card
        sx={{
          width: 500,
          borderRadius: 4,
          boxShadow: 6,
          backdropFilter: "blur(10px)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Title */}
          <Typography
            variant="h5"
            align="center"
            fontWeight="bold"
            color="primary"
            gutterBottom
          >
            Forgot Password
          </Typography>
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            mb={3}
          >
            Enter your registered email address to receive a reset link.
          </Typography>

          {/* Email */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ borderRadius: 2 }}
            />

            {/* Submit Button */}
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{
                mt: 3,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "bold",
                py: 1.2,
              }}
            >
              Send Reset Link
            </Button>
          </form>

          {/* Back to Login */}
          <Typography
            variant="body2"
            color="primary"
            align="center"
            onClick={() => navigate("/login")}
            sx={{
              mt: 3,
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Back to Login
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ForgotPassword;
