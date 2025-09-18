import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  CardContent,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  Stack,
  Paper,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
// import axiosInstance from "../utils/axiosInstance"; // Update this path to match your project structure
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Settings as SettingsIcon,
  Public as PublicIcon,
  Email as EmailIcon,
  Image as ImageIcon,
  Language as LanguageIcon,
  Schedule as ScheduleIcon,
  Copyright as CopyrightIcon,
  Share as ShareIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";

const GeneralSettings = () => {
  const navigate = useNavigate();
  const dateFormats = [
    {
      value: "F j, Y",
      label: "August 28, 2025",
      description: "F j, Y",
    },
    {
      value: "Y-m-d",
      label: "2025-08-28",
      description: "Y-m-d",
    },
    {
      value: "m/d/Y",
      label: "08/28/2025",
      description: "m/d/Y",
    },
    {
      value: "d/m/Y",
      label: "28/08/2025",
      description: "d/m/Y",
    },
    {
      value: "M j, Y",
      label: "Aug 28, 2025",
      description: "M j, Y",
    },
    {
      value: "j F Y",
      label: "28 August 2025",
      description: "j F Y",
    },
    {
      value: "d-m-Y",
      label: "28-08-2025",
      description: "d-m-Y",
    },
    {
      value: "m-d-Y",
      label: "08-28-2025",
      description: "m-d-Y",
    },
  ];
  const [settings, setSettings] = useState({
    siteTitle: "",
    tagline: "",
    siteAddress: "https://chalanachitram.com",
    adminEmail: "admin@chalanachitram.com",
    timezone: "UTC-5:30",
    dateFormat: "august-28-2025",
    timeFormat: "11:09-am",
    weekStartsOn: "monday",
    copyrightMessage: "",
    socialMedia: {
      facebook: "",
      instagram: "",
      linkedin: "",
      twitter: "",
      youtube: "",
    },
    logo: null,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState(null);

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/settings");
      console.log("Fetched settings:", response.data);

      if (response.data.success) {
        const fetchedSettings = response.data.data;
        setSettings({
          siteTitle: fetchedSettings.siteTitle || "",
          tagline: fetchedSettings.tagline || "",
          siteAddress:
            fetchedSettings.siteAddress || "https://chalanachitram.com",
          adminEmail: fetchedSettings.adminEmail || "admin@chalanachitram.com",
          timezone: fetchedSettings.timezone || "UTC-5:30",
          dateFormat: fetchedSettings.dateFormat || "august-28-2025",
          timeFormat: fetchedSettings.timeFormat || "11:09-am",
          weekStartsOn: fetchedSettings.weekStartsOn || "monday",
          copyrightMessage: fetchedSettings.copyrightMessage || "",
          socialMedia: {
            facebook: fetchedSettings.socialMedia?.facebook || "",
            instagram: fetchedSettings.socialMedia?.instagram || "",
            linkedin: fetchedSettings.socialMedia?.linkedin || "",
            twitter: fetchedSettings.socialMedia?.twitter || "",
            youtube: fetchedSettings.socialMedia?.youtube || "",
          },
          logo: fetchedSettings.logo
            ? {
                preview: fetchedSettings.logo.url,
                name: "Current Logo",
                existing: true,
              }
            : null,
        });
      } else {
        // toast.error("Failed to fetch settings");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Error loading settings");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialMediaChange = (platform, value) => {
    setSettings((prev) => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value,
      },
    }));
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSettings((prev) => ({
          ...prev,
          logo: {
            file: file,
            preview: e.target.result,
            name: file.name,
            existing: false,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setSettings((prev) => ({
      ...prev,
      logo: null,
    }));
    setLogoFile(null);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Validate required fields
      if (!settings.siteTitle.trim()) {
        toast.error("Site title is required");
        return;
      }

      if (
        !settings.adminEmail.trim() ||
        !/\S+@\S+\.\S+/.test(settings.adminEmail)
      ) {
        toast.error("Valid admin email is required");
        return;
      }

      // Prepare form data
      const formData = new FormData();
      formData.append("siteTitle", settings.siteTitle);
      formData.append("tagline", settings.tagline);
      formData.append("siteAddress", settings.siteAddress);
      formData.append("adminEmail", settings.adminEmail);
      formData.append("timezone", settings.timezone);
      formData.append("dateFormat", settings.dateFormat);
      formData.append("timeFormat", settings.timeFormat);
      formData.append("weekStartsOn", settings.weekStartsOn);
      formData.append("copyrightMessage", settings.copyrightMessage);
      formData.append("socialMedia", JSON.stringify(settings.socialMedia));

      // Add logo file if there's a new one
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      const response = await axiosInstance.post("/settings/save", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Settings saved successfully!");

        // Update the logo state with the new URL if a new logo was uploaded
        if (response.data.data.logo && logoFile) {
          setSettings((prev) => ({
            ...prev,
            logo: {
              preview: response.data.data.logo.url,
              name: "Current Logo",
              existing: true,
            },
          }));
          setLogoFile(null);
        }
      } else {
        toast.error(response.data.msg || "Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error(
        error.response?.data?.msg || "Error saving settings. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const timezones = [
    { value: "UTC-5:30", label: "UTC-5:30 (India)" },
    { value: "UTC-8:00", label: "UTC-8:00 (Pacific)" },
    { value: "UTC-5:00", label: "UTC-5:00 (Eastern)" },
    { value: "UTC+0:00", label: "UTC+0:00 (London)" },
    { value: "UTC+1:00", label: "UTC+1:00 (Paris)" },
  ];

  const weekDays = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={60} sx={{ color: "#667eea" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8fafc",
        backgroundImage: `
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.03) 0%, transparent 50%)
        `,
      }}
      p={3}
    >
      <Box>
        {/* Back Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/admin/dashboard")}
            sx={{
              textTransform: "none",
              fontSize: "0.95rem",
              fontWeight: 500,
              px: 0,
              color: "#64748b",
              "&:hover": {
                bgcolor: "rgba(59, 130, 246, 0.08)",
                color: "#3b82f6",
              },
            }}
          >
            Back to Dashboard
          </Button>
        </Box>

        {/* Modern Header */}
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
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <SettingsIcon sx={{ fontSize: "2rem", color: "#667eea" }} />
            General Settings
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#64748b",
              fontSize: "1.1rem",
            }}
          >
            Configure your site's basic information and preferences
          </Typography>
        </Box>

        {/* Single Column Layout */}
        <Box sx={{ maxWidth: "800px", mx: "auto" }}>
          <Stack spacing={4}>
            {/* Site Identity */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
                bgcolor: "#ffffff",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    fontWeight: 600,
                    color: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <PublicIcon sx={{ color: "#3b82f6" }} />
                  Site Identity
                </Typography>

                <Stack spacing={3}>
                  <TextField
                    label="Site Title *"
                    value={settings.siteTitle}
                    onChange={(e) =>
                      handleInputChange("siteTitle", e.target.value)
                    }
                    fullWidth
                    variant="outlined"
                    placeholder="Enter your site title"
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        bgcolor: "#f8fafc",
                        "&:hover": {
                          bgcolor: "#f1f5f9",
                        },
                        "&:hover fieldset": {
                          borderColor: "#3b82f6",
                        },
                        "&.Mui-focused": {
                          bgcolor: "#ffffff",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#3b82f6",
                          borderWidth: "2px",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#3b82f6",
                      },
                    }}
                  />

                  <TextField
                    label="Tagline"
                    value={settings.tagline}
                    onChange={(e) =>
                      handleInputChange("tagline", e.target.value)
                    }
                    fullWidth
                    variant="outlined"
                    placeholder="Just another WordPress site"
                    helperText="In a few words, explain what this site is about."
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        bgcolor: "#f8fafc",
                        "&:hover": {
                          bgcolor: "#f1f5f9",
                        },
                        "&:hover fieldset": {
                          borderColor: "#3b82f6",
                        },
                        "&.Mui-focused": {
                          bgcolor: "#ffffff",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#3b82f6",
                          borderWidth: "2px",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#3b82f6",
                      },
                    }}
                  />

                  {/* Logo Upload Section */}
                  <Box
                    sx={{
                      p: 3,
                      bgcolor: "#f1f5f9",
                      borderRadius: "16px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        mb: 3,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 60,
                          height: 60,
                          bgcolor: settings.logo ? "transparent" : "#3b82f6",
                          fontSize: "1.5rem",
                        }}
                        src={settings.logo?.preview}
                      >
                        {!settings.logo && <ImageIcon />}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, mb: 0.5, color: "#1e293b" }}
                        >
                          Logo
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                          {settings.logo
                            ? `Current logo: ${settings.logo.name}`
                            : "Upload a logo for your site"}
                        </Typography>
                      </Box>
                    </Box>
                    <Stack direction="row" spacing={2}>
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="logo-upload"
                        type="file"
                        onChange={handleLogoUpload}
                      />
                      <label htmlFor="logo-upload">
                        <Button
                          variant="contained"
                          component="span"
                          startIcon={<CloudUploadIcon />}
                          sx={{
                            borderRadius: "8px",
                            textTransform: "none",
                            bgcolor: "#3b82f6",
                            "&:hover": { bgcolor: "#2563eb" },
                          }}
                        >
                          {settings.logo ? "Change Logo" : "Upload Logo"}
                        </Button>
                      </label>
                      {settings.logo && (
                        <Button
                          variant="outlined"
                          onClick={handleRemoveLogo}
                          sx={{
                            borderRadius: "8px",
                            textTransform: "none",
                            borderColor: "#d1d5db",
                            color: "#374151",
                            "&:hover": {
                              borderColor: "#9ca3af",
                              bgcolor: "#f9fafb",
                            },
                          }}
                        >
                          Remove Logo
                        </Button>
                      )}
                    </Stack>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", mt: 2, color: "#64748b" }}
                    >
                      The Logo should be square and at least 512 × 512 pixels
                      for best results. Max file size: 5MB.
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Paper>

            {/* Site Configuration */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
                bgcolor: "#ffffff",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    fontWeight: 600,
                    color: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <SettingsIcon sx={{ color: "#3b82f6" }} />
                  Site Configuration
                </Typography>

                <TextField
                  label="Site Address (URL)"
                  value={settings.siteAddress}
                  onChange={(e) =>
                    handleInputChange("siteAddress", e.target.value)
                  }
                  fullWidth
                  variant="outlined"
                  helperText="Enter the address where your site can be found."
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      bgcolor: "#f8fafc",
                      "&:hover": {
                        bgcolor: "#f1f5f9",
                      },
                      "&:hover fieldset": {
                        borderColor: "#3b82f6",
                      },
                      "&.Mui-focused": {
                        bgcolor: "#ffffff",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#3b82f6",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#3b82f6",
                    },
                  }}
                />
              </CardContent>
            </Paper>

            {/* Administration */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
                bgcolor: "#ffffff",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    fontWeight: 600,
                    color: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <EmailIcon sx={{ color: "#3b82f6" }} />
                  Administration
                </Typography>

                <TextField
                  label="Administration Email Address *"
                  value={settings.adminEmail}
                  onChange={(e) =>
                    handleInputChange("adminEmail", e.target.value)
                  }
                  fullWidth
                  variant="outlined"
                  type="email"
                  required
                  helperText="This address is used for admin purposes. If you change this, an email will be sent to your new address to confirm it."
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      bgcolor: "#f8fafc",
                      "&:hover": {
                        bgcolor: "#f1f5f9",
                      },
                      "&:hover fieldset": {
                        borderColor: "#3b82f6",
                      },
                      "&.Mui-focused": {
                        bgcolor: "#ffffff",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#3b82f6",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#3b82f6",
                    },
                  }}
                />
              </CardContent>
            </Paper>

            {/* Copyright & Footer Information */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
                bgcolor: "#ffffff",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    fontWeight: 600,
                    color: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <CopyrightIcon sx={{ color: "#3b82f6" }} />
                  Copyright & Footer Information
                </Typography>

                <TextField
                  label="Copyright Message"
                  value={settings.copyrightMessage}
                  onChange={(e) =>
                    handleInputChange("copyrightMessage", e.target.value)
                  }
                  fullWidth
                  variant="outlined"
                  placeholder="© 2025 Your Company Name. All rights reserved."
                  helperText="This message will appear in the footer of your site."
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      bgcolor: "#f8fafc",
                      "&:hover": {
                        bgcolor: "#f1f5f9",
                      },
                      "&:hover fieldset": {
                        borderColor: "#3b82f6",
                      },
                      "&.Mui-focused": {
                        bgcolor: "#ffffff",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#3b82f6",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#3b82f6",
                    },
                  }}
                />
              </CardContent>
            </Paper>

            {/* Social Media Links */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
                bgcolor: "#ffffff",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    fontWeight: 600,
                    color: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <ShareIcon sx={{ color: "#3b82f6" }} />
                  Social Media Links
                </Typography>

                <Stack spacing={3}>
                  <TextField
                    label="Facebook URL"
                    value={settings.socialMedia.facebook}
                    onChange={(e) =>
                      handleSocialMediaChange("facebook", e.target.value)
                    }
                    fullWidth
                    variant="outlined"
                    placeholder="https://facebook.com/yourpage"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        bgcolor: "#f8fafc",
                        "&:hover": {
                          bgcolor: "#f1f5f9",
                        },
                        "&:hover fieldset": {
                          borderColor: "#3b82f6",
                        },
                        "&.Mui-focused": {
                          bgcolor: "#ffffff",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#3b82f6",
                          borderWidth: "2px",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#3b82f6",
                      },
                    }}
                  />

                  <TextField
                    label="Instagram URL"
                    value={settings.socialMedia.instagram}
                    onChange={(e) =>
                      handleSocialMediaChange("instagram", e.target.value)
                    }
                    fullWidth
                    variant="outlined"
                    placeholder="https://instagram.com/youraccount"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        bgcolor: "#f8fafc",
                        "&:hover": {
                          bgcolor: "#f1f5f9",
                        },
                        "&:hover fieldset": {
                          borderColor: "#3b82f6",
                        },
                        "&.Mui-focused": {
                          bgcolor: "#ffffff",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#3b82f6",
                          borderWidth: "2px",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#3b82f6",
                      },
                    }}
                  />

                  <TextField
                    label="LinkedIn URL"
                    value={settings.socialMedia.linkedin}
                    onChange={(e) =>
                      handleSocialMediaChange("linkedin", e.target.value)
                    }
                    fullWidth
                    variant="outlined"
                    placeholder="https://linkedin.com/in/yourprofile"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        bgcolor: "#f8fafc",
                        "&:hover": {
                          bgcolor: "#f1f5f9",
                        },
                        "&:hover fieldset": {
                          borderColor: "#3b82f6",
                        },
                        "&.Mui-focused": {
                          bgcolor: "#ffffff",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#3b82f6",
                          borderWidth: "2px",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#3b82f6",
                      },
                    }}
                  />

                  <TextField
                    label="Twitter URL"
                    value={settings.socialMedia.twitter}
                    onChange={(e) =>
                      handleSocialMediaChange("twitter", e.target.value)
                    }
                    fullWidth
                    variant="outlined"
                    placeholder="https://twitter.com/youraccount"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        bgcolor: "#f8fafc",
                        "&:hover": {
                          bgcolor: "#f1f5f9",
                        },
                        "&:hover fieldset": {
                          borderColor: "#3b82f6",
                        },
                        "&.Mui-focused": {
                          bgcolor: "#ffffff",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#3b82f6",
                          borderWidth: "2px",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#3b82f6",
                      },
                    }}
                  />

                  <TextField
                    label="YouTube URL"
                    value={settings.socialMedia.youtube}
                    onChange={(e) =>
                      handleSocialMediaChange("youtube", e.target.value)
                    }
                    fullWidth
                    variant="outlined"
                    placeholder="https://youtube.com/yourchannel"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        bgcolor: "#f8fafc",
                        "&:hover": {
                          bgcolor: "#f1f5f9",
                        },
                        "&:hover fieldset": {
                          borderColor: "#3b82f6",
                        },
                        "&.Mui-focused": {
                          bgcolor: "#ffffff",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#3b82f6",
                          borderWidth: "2px",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#3b82f6",
                      },
                    }}
                  />
                </Stack>
              </CardContent>
            </Paper>

            {/* Localization & Date/Time Settings */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
                bgcolor: "#ffffff",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    fontWeight: 600,
                    color: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <LanguageIcon sx={{ color: "#3b82f6" }} />
                  Localization & Time Settings
                </Typography>

                <Stack spacing={4}>
                  {/* Timezone */}
                  <FormControl fullWidth>
                    <InputLabel sx={{ "&.Mui-focused": { color: "#3b82f6" } }}>
                      Timezone
                    </InputLabel>
                    <Select
                      value={settings.timezone}
                      onChange={(e) =>
                        handleInputChange("timezone", e.target.value)
                      }
                      label="Timezone"
                      sx={{
                        borderRadius: "12px",
                        bgcolor: "#f8fafc",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#e2e8f0",
                        },
                        "&:hover": {
                          bgcolor: "#f1f5f9",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#3b82f6",
                        },
                        "&.Mui-focused": {
                          bgcolor: "#ffffff",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#3b82f6",
                        },
                      }}
                    >
                      {timezones.map((tz) => (
                        <MenuItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "#f1f5f9",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "#64748b", mb: 1 }}
                    >
                      Universal time: 2025-08-28 05:39:46
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      Local time: 2025-08-28 11:09:46
                    </Typography>
                  </Box>

                  {/* Date Format */}
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 2, fontWeight: 600, color: "#1e293b" }}
                    >
                      Date Format
                    </Typography>
                    <RadioGroup
                      value={settings.dateFormat}
                      onChange={(e) =>
                        handleInputChange("dateFormat", e.target.value)
                      }
                    >
                      {dateFormats.map((format) => (
                        <FormControlLabel
                          key={format.value}
                          value={format.value}
                          control={
                            <Radio
                              sx={{
                                color: "#3b82f6",
                                "&.Mui-checked": { color: "#3b82f6" },
                              }}
                            />
                          }
                          label={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <span>{format.label}</span>
                              <Typography
                                variant="caption"
                                sx={{ color: "#64748b" }}
                              >
                                {format.description}
                              </Typography>
                            </Box>
                          }
                        />
                      ))}
                    </RadioGroup>
                    <Typography
                      variant="caption"
                      sx={{ color: "#64748b", display: "block", mt: 1 }}
                    >
                      Preview:{" "}
                      {dateFormats.find((f) => f.value === settings.dateFormat)
                        ?.label || "August 28, 2025"}
                    </Typography>
                  </Box>

                  {/* Time Format */}
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 2, fontWeight: 600, color: "#1e293b" }}
                    >
                      Time Format
                    </Typography>
                    <RadioGroup
                      value={settings.timeFormat}
                      onChange={(e) =>
                        handleInputChange("timeFormat", e.target.value)
                      }
                    >
                      <FormControlLabel
                        value="11:09-am"
                        control={
                          <Radio
                            sx={{
                              color: "#3b82f6",
                              "&.Mui-checked": { color: "#3b82f6" },
                            }}
                          />
                        }
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <span>11:09 am</span>
                            <Typography
                              variant="caption"
                              sx={{ color: "#64748b" }}
                            >
                              g:i a
                            </Typography>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="11:09-AM"
                        control={
                          <Radio
                            sx={{
                              color: "#3b82f6",
                              "&.Mui-checked": { color: "#3b82f6" },
                            }}
                          />
                        }
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <span>11:09 AM</span>
                            <Typography
                              variant="caption"
                              sx={{ color: "#64748b" }}
                            >
                              g:i A
                            </Typography>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="11:09"
                        control={
                          <Radio
                            sx={{
                              color: "#3b82f6",
                              "&.Mui-checked": { color: "#3b82f6" },
                            }}
                          />
                        }
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <span>11:09</span>
                            <Typography
                              variant="caption"
                              sx={{ color: "#64748b" }}
                            >
                              H:i
                            </Typography>
                          </Box>
                        }
                      />
                    </RadioGroup>
                    <Typography
                      variant="caption"
                      sx={{ color: "#64748b", display: "block", mt: 1 }}
                    >
                      Preview: 11:09 am
                    </Typography>
                  </Box>

                  {/* Week Starts On */}
                  <FormControl fullWidth>
                    <InputLabel sx={{ "&.Mui-focused": { color: "#3b82f6" } }}>
                      Week Starts On
                    </InputLabel>
                    <Select
                      value={settings.weekStartsOn}
                      onChange={(e) =>
                        handleInputChange("weekStartsOn", e.target.value)
                      }
                      label="Week Starts On"
                      sx={{
                        borderRadius: "12px",
                        bgcolor: "#f8fafc",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#e2e8f0",
                        },
                        "&:hover": {
                          bgcolor: "#f1f5f9",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#3b82f6",
                        },
                        "&.Mui-focused": {
                          bgcolor: "#ffffff",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#3b82f6",
                        },
                      }}
                    >
                      {weekDays.map((day) => (
                        <MenuItem key={day.value} value={day.value}>
                          {day.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </CardContent>
            </Paper>

            {/* Save Button */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
                bgcolor: "#ffffff",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Button
                  variant="contained"
                  startIcon={
                    saving ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <SaveIcon />
                    )
                  }
                  onClick={handleSave}
                  fullWidth
                  disabled={saving}
                  sx={{
                    borderRadius: "12px",
                    py: 1.5,
                    background: saving
                      ? "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)"
                      : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "1rem",
                    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                    "&:hover": {
                      background: saving
                        ? "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)"
                        : "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                      transform: saving ? "none" : "translateY(-2px)",
                      boxShadow: saving
                        ? "0 4px 15px rgba(102, 126, 234, 0.4)"
                        : "0 8px 25px rgba(102, 126, 234, 0.6)",
                    },
                    "&:disabled": {
                      color: "#ffffff",
                      opacity: 0.7,
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {saving ? "Saving Changes..." : "Save Changes"}
                </Button>
              </CardContent>
            </Paper>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default GeneralSettings;
