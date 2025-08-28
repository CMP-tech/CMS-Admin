import React, { useState } from "react";
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
} from "@mui/material";
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Settings as SettingsIcon,
  Public as PublicIcon,
  Email as EmailIcon,
  Image as ImageIcon,
  Language as LanguageIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const GeneralSettings = () => {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    siteTitle: "",
    tagline: "",
    siteAddress: "https://chalanachitram.com",
    adminEmail: "admin@chalanachitram.com",
    timezone: "UTC-5:30",
    dateFormat: "august-28-2025",
    timeFormat: "11:09-am",
    weekStartsOn: "monday",
  });

  const handleInputChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    console.log("Saving settings...", settings);
  };

  const timezones = [
    { value: "UTC-5:30", label: "UTC-5:30" },
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
                    label="Site Title"
                    value={settings.siteTitle}
                    onChange={(e) =>
                      handleInputChange("siteTitle", e.target.value)
                    }
                    fullWidth
                    variant="outlined"
                    placeholder="Enter your site title"
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

                  {/* Site Icon Section */}
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
                          bgcolor: "#3b82f6",
                          fontSize: "1.5rem",
                        }}
                      >
                        <ImageIcon />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, mb: 0.5, color: "#1e293b" }}
                        >
                          Site Icon
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                          Add a site icon for browser tabs and mobile apps
                        </Typography>
                      </Box>
                    </Box>
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="contained"
                        sx={{
                          borderRadius: "8px",
                          textTransform: "none",
                          bgcolor: "#3b82f6",
                          "&:hover": { bgcolor: "#2563eb" },
                        }}
                      >
                        Change Site Icon
                      </Button>
                      <Button
                        variant="outlined"
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
                        Remove Site Icon
                      </Button>
                    </Stack>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", mt: 2, color: "#64748b" }}
                    >
                      The Site Icon should be square and at least 512 × 512
                      pixels.
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
                  label="Administration Email Address"
                  value={settings.adminEmail}
                  onChange={(e) =>
                    handleInputChange("adminEmail", e.target.value)
                  }
                  fullWidth
                  variant="outlined"
                  type="email"
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
                      <FormControlLabel
                        value="august-28-2025"
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
                            <span>August 28, 2025</span>
                            <Typography
                              variant="caption"
                              sx={{ color: "#64748b" }}
                            >
                              F j, Y
                            </Typography>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="2025-08-28"
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
                            <span>2025-08-28</span>
                            <Typography
                              variant="caption"
                              sx={{ color: "#64748b" }}
                            >
                              Y-m-d
                            </Typography>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="08/28/2025"
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
                            <span>08/28/2025</span>
                            <Typography
                              variant="caption"
                              sx={{ color: "#64748b" }}
                            >
                              m/d/Y
                            </Typography>
                          </Box>
                        }
                      />
                    </RadioGroup>
                    <Typography
                      variant="caption"
                      sx={{ color: "#64748b", display: "block", mt: 1 }}
                    >
                      Preview: August 28, 2025
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
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  fullWidth
                  sx={{
                    borderRadius: "12px",
                    py: 1.5,
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
                    transition: "all 0.3s ease",
                  }}
                >
                  Save Changes
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
