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

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminDetails");
    navigate("/login");
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

  // Profile menu handlers
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
      text: "Settings",
      icon: <SettingsIcon />,
      children: [
        { text: "Social Media", path: "/settings/social-media" },
        { text: "Copyright", path: "/settings/copyright" },
      ],
    },

    {
      text: "Contact Requests",
      icon: <ContactMailIcon />,
      path: "/admin/contact-request",
    },
  ];

  // Auto-expand a parent menu if a child path is active
  useEffect(() => {
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
  }, [currentPath]);

  return (
    <Box sx={{ display: "flex" }}>
      {/* Top AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          marginLeft: drawerWidth,
          width: `calc(100% - ${drawerWidth}px)`,
          backgroundColor: "#0d2033ff",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Left side - can add breadcrumbs or page title here */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* You can add breadcrumbs or current page title here */}
          </Box>

          {/* Right side - Profile Menu */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Online Status Indicator */}
            <Chip
              label="Online"
              size="small"
              sx={{
                bgcolor: "success.main",
                color: "white",
                fontSize: "0.75rem",
                height: "24px",
              }}
            />

            {/* Profile Menu Button */}
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "white",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                },
                borderRadius: 2,
                px: 2,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 32,
                  height: 32,
                  fontSize: "0.9rem",
                }}
              >
                R
              </Avatar>
              <Box
                sx={{ textAlign: "left", display: { xs: "none", sm: "block" } }}
              >
                <Typography variant="body2" sx={{ lineHeight: 1.2 }}>
                  Roshan Admin
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255,255,255,0.7)", lineHeight: 1 }}
                >
                  Administrator
                </Typography>
              </Box>
              <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
            </IconButton>

            {/* Profile Dropdown Menu */}
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
              {/* Profile Header in Menu */}
              <Box sx={{ p: 2, borderBottom: "1px solid #f0f0f0" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{ bgcolor: "primary.main", width: 40, height: 40 }}
                  >
                    R
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Roshan Admin
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      roshan@admin.com
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Menu Items */}
              <MenuItem
                onClick={handleProfileClick}
                sx={{
                  py: 1.5,
                  "&:hover": {
                    bgcolor: "primary.50",
                  },
                }}
              >
                <ListItemIcon>
                  <AccountCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="My Profile"
                  secondary="View and edit profile"
                />
              </MenuItem>

              <MenuItem
                onClick={handleChangePasswordClick}
                sx={{
                  py: 1.5,
                  "&:hover": {
                    bgcolor: "warning.50",
                  },
                }}
              >
                <ListItemIcon>
                  <LockResetIcon color="warning" />
                </ListItemIcon>
                <ListItemText
                  primary="Change Password"
                  secondary="Update your password"
                />
              </MenuItem>

              <Divider sx={{ my: 1 }} />

              <MenuItem
                onClick={handleLogout}
                sx={{
                  py: 1.5,
                  "&:hover": {
                    bgcolor: "error.50",
                  },
                }}
              >
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

      {/* Sidebar Drawer - Simplified without profile section */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            whiteSpace: "nowrap",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            background: "#000",
            color: "#fff",
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

        <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />

        {/* Menu Items */}
        <List sx={{ flexGrow: 1, pt: 2 }}>
          {menuItems.map((item) => {
            const isActive = currentPath === item.path;

            if (!item.children) {
              return (
                <ListItem
                  key={item.text}
                  disablePadding
                  sx={{ display: "block", mb: 0.5 }}
                >
                  <ListItemButton
                    onClick={() => handleMenuItemClick(item.path)}
                    sx={{
                      minHeight: 48,
                      justifyContent: "initial",
                      px: 2.5,
                      mx: 1,
                      borderRadius: 2,
                      backgroundColor: isActive ? "#1976d2" : "transparent",
                      "&:hover": {
                        backgroundColor: isActive
                          ? "#1565c0"
                          : "rgba(25, 118, 210, 0.2)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 3,
                        justifyContent: "center",
                        color: "#fff",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      sx={{
                        color: "#fff",
                        "& .MuiTypography-root": {
                          fontWeight: isActive ? "bold" : "normal",
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            }

            // Menu with children
            return (
              <React.Fragment key={item.text}>
                <ListItem disablePadding sx={{ display: "block", mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => toggleMenu(item.text)}
                    sx={{
                      minHeight: 48,
                      justifyContent: "initial",
                      px: 2.5,
                      mx: 1,
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.2)",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 0, mr: 3, color: "#fff" }}>
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
                            sx={{
                              minHeight: 40,
                              px: 2.5,
                              mx: 1,
                              borderRadius: 2,
                              backgroundColor: isChildActive
                                ? "#1976d2"
                                : "transparent",
                              "&:hover": {
                                backgroundColor: isChildActive
                                  ? "#1565c0"
                                  : "rgba(25, 118, 210, 0.2)",
                              },
                            }}
                          >
                            {child.icon && (
                              <ListItemIcon
                                sx={{ color: "#fff", minWidth: 30 }}
                              >
                                {child.icon}
                              </ListItemIcon>
                            )}
                            <ListItemText
                              primary={child.text}
                              sx={{
                                color: "#fff",
                                "& .MuiTypography-root": {
                                  fontSize: "0.9rem",
                                  fontWeight: isChildActive ? "bold" : "normal",
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
      <Box component="main" sx={{ width: "100%", mt: "64px", padding: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
