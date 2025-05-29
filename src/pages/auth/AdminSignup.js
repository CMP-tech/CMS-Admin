// src/pages/AdminSignup.js
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
} from "@mui/material";
import axios from "axios";

export default function AdminSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("api/admin/signup", {
        name,
        email,
        password,
      });

      if (response.status === 201) {
        // Signup successful, navigate to login
        navigate("/login");
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Something went wrong. Try again.";
      setError(message);
    } finally {
      setLoading(false);
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
        <Card elevation={3} sx={{ borderRadius: 2, overflow: "visible" }}>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{ fontWeight: "bold", color: "primary.main", mb: 3 }}
            >
              Admin Signup
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

            <Box>
              <TextField
                fullWidth
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
              />
              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: "medium",
                }}
                onClick={handleSignup}
                disabled={loading || !name || !email || !password}
              >
                {loading ? "Signing up..." : "Signup"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
