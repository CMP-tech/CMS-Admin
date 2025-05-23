// src/pages/AdminLogin.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  Container,
} from "@mui/material";
// Import your theme

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      // Simulate login API call
      const response = await axios.post("/api/auth/login", { email, password });
      if (response.status === 200) {
        // Normally, save token and user info to context or localStorage
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
      navigate("/");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={3}
          sx={{
            borderRadius: 2,
            overflow: "visible",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              align="center"
              gutterBottom
              sx={{
                fontWeight: "bold",
                color: "primary.main",
                mb: 3,
              }}
            >
              Admin Login
            </Typography>

            {error && (
              <Alert
                severity="error"
                sx={{ mb: 3 }}
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            )}

            <Box component="form" noValidate>
              <TextField
                fullWidth
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="admin@example.com"
                margin="normal"
                required
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="••••••••"
                margin="normal"
                required
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
              />

              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
                <Link
                  href="/forgot-password"
                  variant="body2"
                  sx={{
                    color: "secondary.main",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Forgot Password?
                </Link>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleLogin}
                disabled={loading || !email || !password}
                sx={{
                  py: 1.5,
                  borderRadius: 1,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: "medium",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                  "&:disabled": {
                    backgroundColor: "action.disabled",
                  },
                }}
              >
                {loading ? "Signing in..." : "Login"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
