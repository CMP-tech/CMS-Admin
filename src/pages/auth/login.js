import React, { use, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
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
            Welcome Back
          </Typography>
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            mb={3}
          >
            Please login to continue
          </Typography>

          {/* Email */}
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            margin="normal"
            sx={{ borderRadius: 2 }}
          />

          {/* Password */}
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            margin="normal"
            sx={{ borderRadius: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Login Button */}
          <Button
            fullWidth
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
            Login
          </Button>

          {/* Forgot Password + Register */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Typography
              variant="body2"
              color="primary"
              sx={{
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {/* Forgot Password? */}
            </Typography>
            <Typography
              variant="body2"
              color="primary"
              //   onClick={() => navigate("/forgot-password")}
              sx={{
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Forgot Password?
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
