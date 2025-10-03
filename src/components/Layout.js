import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import ArticleIcon from "@mui/icons-material/Article";
import CategoryIcon from "@mui/icons-material/Category";
import TranslateIcon from "@mui/icons-material/Translate";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockResetIcon from "@mui/icons-material/LockReset";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  useTheme,
  Collapse,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  CircularProgress,
} from "@mui/material";

import logo from "../assets/logo-cms.png";

const drawerWidth = 240;

const Layout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [openMenus, setOpenMenus] = useState({});
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminDetails, setAdminDetails] = useState(null);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check for both possible token keys (token and adminToken)
        const token =
          localStorage.getItem("token") || localStorage.getItem("adminToken");
        const storedAdminDetails = localStorage.getItem("adminDetails");

        if (!token) {
          // No token found, redirect to login
          navigate("/login", { replace: true });
          return;
        }

        // Parse admin details if available
        if (storedAdminDetails) {
          try {
            const parsedDetails = JSON.parse(storedAdminDetails);
            setAdminDetails(parsedDetails);
          } catch (error) {
            console.error("Error parsing admin details:", error);
          }
        }
        console.log("Admin Details:", adminDetails);
        // Token exists, user is authenticated
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Authentication check failed:", error);
        // Clear potentially corrupted data
        localStorage.removeItem("token");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminDetails");
        navigate("/login", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminDetails");
    setIsAuthenticated(false);
    setAdminDetails(null);
    navigate("/login", { replace: true });
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
  };

  const toggleMenu = (menuText) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuText]: !prev[menuText],
    }));
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleProfileClick = () => {
    handleProfileMenuClose();
    navigate("/admin/profile");
  };

  const handleChangePasswordClick = () => {
    handleProfileMenuClose();
    navigate("/admin/change-password");
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
    {
      text: "All Posts",
      icon: <ArticleIcon />,
      children: [
        { text: "Posts", path: "/admin/posts", icon: <ArticleIcon /> },
        {
          text: "Categories",
          path: "/admin/categories",
          icon: <CategoryIcon />,
        },
        {
          text: "Languages",
          path: "/admin/languages",
          icon: <TranslateIcon />,
        },
      ],
    },
    {
      text: "Media",
      icon: <PermMediaIcon />,
      children: [
        {
          text: "Library",
          path: "/admin/media/library",
          icon: <PhotoLibraryIcon />,
        },
        {
          text: "Add Media File",
          path: "/admin/media/add",
          icon: <AddPhotoAlternateIcon />,
        },
      ],
    },
    {
      text: "Settings",
      icon: <SettingsIcon />,
      children: [
        // { text: "Social Media", path: "/settings/social-media" },
        { text: "General", path: "/settings/general" },
        { text: "Reading", path: "/settings/reading" },
        { text: "Privacy", path: "/settings/privacy" },
        { text: "Google Analytics", path: "/settings/google-analytics" },
        // { text: "Copyright", path: "/settings/copyright" },
      ],
    },
    {
      text: "Contact Requests",
      icon: <ContactMailIcon />,
      path: "/admin/contact-request",
    },
  ];

  // Auto-expand menu if child is active
  useEffect(() => {
    if (isAuthenticated) {
      menuItems.forEach((item) => {
        if (item.children) {
          const hasActiveChild = item.children.some(
            (child) => child.path === currentPath
          );
          if (hasActiveChild) {
            setOpenMenus((prev) => ({ ...prev, [item.text]: true }));
          }
        }
      });
    }
  }, [currentPath, isAuthenticated]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          bgcolor: "#f5f6fa",
        }}
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  // If not authenticated, don't render the layout (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  // Get display name from admin details or fallback
  const displayName =
    adminDetails?.name || adminDetails?.username || "Admin User";
  const displayEmail = adminDetails?.email || "admin@example.com";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <Box sx={{ display: "flex" }}>
      {/* Top AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          ml: drawerWidth,
          width: `calc(100% - ${drawerWidth}px)`,
          bgcolor: "#fff",
          color: "#000",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box />

          {/* Right side */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Chip
              label="Online"
              size="small"
              sx={{
                bgcolor: "success.main",
                color: "#fff",
                fontSize: "0.75rem",
                height: "24px",
              }}
            />

            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#000",
                borderRadius: 2,
                px: 2,
                "&:hover": { bgcolor: "#f5f5f5" },
              }}
            >
              <Avatar sx={{ bgcolor: "#1976d2", width: 32, height: 32 }}>
                {avatarLetter}
              </Avatar>
              <Box
                sx={{ textAlign: "left", display: { xs: "none", sm: "block" } }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {displayName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Administrator
                </Typography>
              </Box>
              <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
            </IconButton>

            {/* Profile Dropdown */}
            <Menu
              anchorEl={profileMenuAnchor}
              open={Boolean(profileMenuAnchor)}
              onClose={handleProfileMenuClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 200,
                  borderRadius: 2,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Box sx={{ p: 2, borderBottom: "1px solid #f0f0f0" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "#1976d2", width: 40, height: 40 }}>
                    {avatarLetter}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {displayName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {displayEmail}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <MenuItem onClick={handleProfileClick}>
                <ListItemIcon>
                  <AccountCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="My Profile"
                  secondary="View and edit profile"
                />
              </MenuItem>

              <MenuItem onClick={handleChangePasswordClick}>
                <ListItemIcon>
                  <LockResetIcon color="warning" />
                </ListItemIcon>
                <ListItemText
                  primary="Change Password"
                  secondary="Update your password"
                />
              </MenuItem>

              <Divider sx={{ my: 1 }} />

              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon color="error" />
                </ListItemIcon>
                <ListItemText
                  primary="Logout"
                  secondary="Sign out of account"
                />
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#fff",
            color: "#000",
            borderRight: "1px solid #e0e0e0",
          },
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
        >
          <Box component="img" sx={{ height: 40 }} alt="Logo" src={logo} />
        </Box>

        <Divider />

        {/* Menu Items */}
        <List sx={{ flexGrow: 1, pt: 2 }}>
          {menuItems.map((item) => {
            const isActive = currentPath === item.path;

            if (!item.children) {
              return (
                <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => handleMenuItemClick(item.path)}
                    selected={isActive}
                    sx={{
                      borderRadius: 2,
                      mx: 1,
                      "&.Mui-selected": {
                        bgcolor: "#1976d2",
                        color: "#fff",
                        "& .MuiSvgIcon-root": { color: "#fff" },
                        "&:hover": { bgcolor: "#1565c0" },
                      },
                      "&:hover": { bgcolor: "#f5f5f5" },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isActive ? "#fff" : "#757575",
                        minWidth: 0,
                        mr: 2,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      sx={{
                        "& .MuiTypography-root": {
                          fontWeight: isActive ? 600 : 400,
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            }

            // Parent with children
            return (
              <React.Fragment key={item.text}>
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => toggleMenu(item.text)}
                    sx={{
                      borderRadius: 2,
                      mx: 1,
                      "&:hover": { bgcolor: "#f5f5f5" },
                    }}
                  >
                    <ListItemIcon sx={{ color: "#757575", minWidth: 0, mr: 2 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                    {openMenus[item.text] ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>

                <Collapse
                  in={openMenus[item.text]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.children.map((child) => {
                      const isChildActive = currentPath === child.path;
                      return (
                        <ListItem
                          key={child.text}
                          disablePadding
                          sx={{ pl: 2, mb: 0.5 }}
                        >
                          <ListItemButton
                            onClick={() => handleMenuItemClick(child.path)}
                            selected={isChildActive}
                            sx={{
                              borderRadius: 2,
                              mx: 1,
                              "&.Mui-selected": {
                                bgcolor: "#1976d2",
                                color: "#fff",
                                "& .MuiSvgIcon-root": { color: "#fff" },
                                "&:hover": { bgcolor: "#1565c0" },
                              },
                              "&:hover": { bgcolor: "#f5f5f5" },
                            }}
                          >
                            {child.icon && (
                              <ListItemIcon
                                sx={{
                                  color: isChildActive ? "#fff" : "#757575",
                                  minWidth: 30,
                                }}
                              >
                                {child.icon}
                              </ListItemIcon>
                            )}
                            <ListItemText
                              primary={child.text}
                              sx={{
                                "& .MuiTypography-root": {
                                  fontSize: "0.9rem",
                                  fontWeight: isChildActive ? 600 : 400,
                                },
                              }}
                            />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              </React.Fragment>
            );
          })}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          width: "100%",
          mt: "64px",
          p: 3,
          bgcolor: "#f5f6fa",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
