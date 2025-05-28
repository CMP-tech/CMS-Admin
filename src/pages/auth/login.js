import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Stack,
  Link,
} from "@mui/material";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("api/admin/login", {
        email,
        password,
      });

      const token = response?.data?.token;

      if (!token) throw new Error("No token received");

      localStorage.setItem("adminToken", token); // ✅ Consistent token key

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("api/admin/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              align="center"
              gutterBottom
              sx={{ fontWeight: "bold", mb: 3 }}
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
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                required
                margin="normal"
                placeholder="admin@example.com"
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                required
                margin="normal"
                placeholder="••••••••"
              />

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleLogin}
                disabled={loading || !email || !password}
                sx={{ py: 1.5, borderRadius: 1, mt: 2, textTransform: "none" }}
              >
                {loading ? "Signing in..." : "Login"}
              </Button>

              <Stack direction="row" justifyContent="space-between" mt={2}>
                <Link
                  href="/admin/forgot-password"
                  underline="hover"
                  variant="body2"
                >
                  Forgot Password?
                </Link>
                <Link
                  component="button"
                  onClick={handleLogout}
                  underline="hover"
                  variant="body2"
                >
                  Logout
                </Link>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
