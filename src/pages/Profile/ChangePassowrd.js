// pages/ChangePasswordPage.jsx
import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  CardContent,
  Paper,
  Stack,
  Container,
  IconButton,
  InputAdornment,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import axiosInstance from "../../axiosInstance";

const ChangePasswordPage = () => {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    let score = 0;
    let feedback = [];

    if (password.length >= 8) {
      score += 20;
    } else {
      feedback.push("At least 8 characters");
    }

    if (/[a-z]/.test(password)) {
      score += 20;
    } else {
      feedback.push("Lowercase letter");
    }

    if (/[A-Z]/.test(password)) {
      score += 20;
    } else {
      feedback.push("Uppercase letter");
    }

    if (/[0-9]/.test(password)) {
      score += 20;
    } else {
      feedback.push("Number");
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 20;
    } else {
      feedback.push("Special character");
    }

    return { score, feedback };
  };

  const passwordStrength = calculatePasswordStrength(passwordData.newPassword);

  const getStrengthLabel = (score) => {
    if (score < 40) return { label: "Weak", color: "error" };
    if (score < 80) return { label: "Fair", color: "warning" };
    if (score < 100) return { label: "Good", color: "info" };
    return { label: "Strong", color: "success" };
  };

  const strengthInfo = getStrengthLabel(passwordStrength.score);

  const handleInputChange = (field) => (event) => {
    setPasswordData({
      ...passwordData,
      [field]: event.target.value,
    });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters long";
    }

    if (!passwordData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      newErrors.newPassword =
        "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      setLoading(true);
      setErrors({});

      try {
        const response = await axiosInstance.put(
          "/users/change-password", // adjust this to match your backend route
          {
            oldPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // adjust if you store token differently
            },
          }
        );

        toast.success(
          response.data.message || "Password updated successfully!"
        );

        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        // Auto logout after password change
        setTimeout(() => {
          localStorage.removeItem("token");
          navigate("/login");
        }, 3000);
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message || "Something went wrong");
        } else {
          toast.error("Network error. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const securityTips = [
    "Use a unique password that you don't use for other accounts",
    "Make it at least 12 characters long",
    "Include a mix of letters, numbers, and special characters",
    "Avoid using personal information like names or birthdays",
    "Consider using a password manager",
  ];

  return (
    <Box sx={{ minHeight: "100vh" }} p={3}>
      <Container maxWidth="md">
        {/* Back Button */}
        <Box sx={{ mb: 1 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/admin/profile")}
            sx={{
              textTransform: "none",
              fontSize: "0.95rem",
              fontWeight: 500,
              px: 0,
              "&:hover": {
                bgcolor: "transparent",
                color: "#3b82f6",
              },
            }}
          >
            Back to Profile
          </Button>
        </Box>

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Change Password
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#64748b",
              fontSize: "1.1rem",
            }}
          >
            Keep your account secure with a strong password
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexDirection: { xs: "column", lg: "row" },
          }}
        >
          {/* Main Form */}
          <Box sx={{ flex: 2 }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
                overflow: "hidden",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 4,
                    fontWeight: 600,
                    color: "#374151",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  🔐 Password Update
                </Typography>

                <form onSubmit={handleSubmit}>
                  <Stack spacing={4}>
                    {/* Current Password */}
                    <TextField
                      label="Current Password"
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={handleInputChange("currentPassword")}
                      fullWidth
                      error={!!errors.currentPassword}
                      helperText={errors.currentPassword}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: "text.secondary" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                togglePasswordVisibility("current")
                              }
                              edge="end"
                            >
                              {showPasswords.current ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    {/* New Password */}
                    <Box>
                      <TextField
                        label="New Password"
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={handleInputChange("newPassword")}
                        fullWidth
                        error={!!errors.newPassword}
                        helperText={errors.newPassword}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon sx={{ color: "text.secondary" }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => togglePasswordVisibility("new")}
                                edge="end"
                              >
                                {showPasswords.new ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />

                      {/* Password Strength Indicator */}
                      {passwordData.newPassword && (
                        <Box sx={{ mt: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Password Strength:
                            </Typography>
                            <Chip
                              label={strengthInfo.label}
                              color={strengthInfo.color}
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={passwordStrength.score}
                            color={strengthInfo.color}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              bgcolor: "grey.200",
                            }}
                          />
                          {passwordStrength.feedback.length > 0 && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 1 }}
                            >
                              Missing: {passwordStrength.feedback.join(", ")}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </Box>

                    {/* Confirm Password */}
                    <TextField
                      label="Confirm New Password"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={handleInputChange("confirmPassword")}
                      fullWidth
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: "text.secondary" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                togglePasswordVisibility("confirm")
                              }
                              edge="end"
                            >
                              {showPasswords.confirm ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    {/* Password Match Indicator */}
                    {passwordData.confirmPassword && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {passwordData.newPassword ===
                        passwordData.confirmPassword ? (
                          <>
                            <CheckCircleIcon
                              color="success"
                              sx={{ fontSize: 20 }}
                            />
                            <Typography variant="body2" color="success.main">
                              Passwords match
                            </Typography>
                          </>
                        ) : (
                          <>
                            <CancelIcon color="error" sx={{ fontSize: 20 }} />
                            <Typography variant="body2" color="error.main">
                              Passwords don't match
                            </Typography>
                          </>
                        )}
                      </Box>
                    )}

                    {/* Submit Button */}
                    <Box sx={{ pt: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<SaveIcon />}
                        disabled={
                          loading ||
                          !passwordData.currentPassword ||
                          !passwordData.newPassword ||
                          !passwordData.confirmPassword
                        }
                        fullWidth
                        sx={{
                          borderRadius: "12px",
                          py: 1.5,
                          px: 3,
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          fontWeight: 600,
                          textTransform: "none",
                          fontSize: "1rem",
                          boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                            transform: "translateY(-2px)",
                            boxShadow: "0 8px 25px rgba(102, 126, 234, 0.6)",
                          },
                          "&:disabled": {
                            background: "#e5e7eb",
                            color: "#9ca3af",
                            transform: "none",
                            boxShadow: "none",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        {loading ? "Updating Password..." : "Update Password"}
                      </Button>
                    </Box>
                  </Stack>
                </form>
              </CardContent>
            </Paper>
          </Box>

          {/* Security Tips Sidebar */}
          <Box sx={{ flex: 1 }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
                overflow: "hidden",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    fontWeight: 600,
                    color: "#374151",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <SecurityIcon color="primary" />
                  Security Tips
                </Typography>

                <List dense>
                  {securityTips.map((tip, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon
                          color="success"
                          sx={{ fontSize: 20 }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={tip}
                        primaryTypographyProps={{
                          variant: "body2",
                          sx: { lineHeight: 1.5 },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ChangePasswordPage;
