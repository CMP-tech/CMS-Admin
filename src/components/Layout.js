import React, { useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

import SchoolIcon from "@mui/icons-material/School";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PaymentIcon from "@mui/icons-material/Payment";
import BarChartIcon from "@mui/icons-material/BarChart";
import ApartmentIcon from "@mui/icons-material/Apartment";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

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
} from "@mui/material";

import logo from "../assets/logo-website-orange.png";

const drawerWidth = 240;

const Layout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const open = true;

  const currentPath = location.pathname;

  const adminDetails = JSON.parse(localStorage.getItem("adminDetails")) || {
    name: "Admin",
    email: "admin@example.com",
    avatar: "A",
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token || !adminDetails) navigate("/login");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminDetails");
    navigate("/login");
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { text: "Schools", icon: <ApartmentIcon />, path: "/admin/schools" },
    { text: "Plans", icon: <SchoolIcon />, path: "/admin/plans" },
    { text: "Invoices", icon: <PaymentIcon />, path: "/admin/invoices" },
    { text: "Usage", icon: <BarChartIcon />, path: "/admin/usage" },
    { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
  ];

  return (
    <Box sx={{ display: "flex", background: "#F5F5F5" }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          marginLeft: drawerWidth,
          width: `calc(100% - ${drawerWidth}px)`,
        }}
      >
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "primary.main" }}>
              {adminDetails.avatar}
            </Avatar>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="subtitle2" color="inherit" noWrap>
                {adminDetails.name}
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        open={true}
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
            background: "#fff8e6",
          },
        }}
      >
        {/* Drawer header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box component="img" sx={{ height: 40 }} alt="Logo" src={logo} />
          </Box>
        </Box>

        <Divider />

        <List>
          {menuItems.map((item) => {
            const isActive =
              currentPath === item.path ||
              (item.path !== "/" && currentPath.startsWith(item.path));

            return (
              <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  onClick={() => handleMenuItemClick(item.path)}
                  sx={{
                    minHeight: 48,
                    justifyContent: "initial",
                    px: 2.5,
                    backgroundColor: isActive
                      ? "rgba(25, 118, 210, 0.08)"
                      : "transparent",
                    position: "relative",
                    "&:hover": {
                      backgroundColor: isActive
                        ? "rgba(25, 118, 210, 0.12)"
                        : "rgba(0, 0, 0, 0.04)",
                    },
                    ...(isActive && {
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: 0,
                        height: "100%",
                        width: "4px",
                        backgroundColor: "primary.main",
                      },
                    }),
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 3,
                      justifyContent: "center",
                      color: isActive ? "primary.main" : "inherit",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      color: isActive ? "primary.main" : "inherit",
                      "& .MuiTypography-root": {
                        fontWeight: isActive ? "bold" : "regular",
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Box sx={{ flexGrow: 1 }} />

        <Divider />

        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "primary.main" }}>{adminDetails.avatar}</Avatar>
            <Box>
              <Typography variant="subtitle2" noWrap>
                {adminDetails.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {adminDetails.email}
              </Typography>
            </Box>
          </Box>

          <ListItemButton
            onClick={handleLogout}
            sx={{ borderRadius: 1, justifyContent: "flex-start" }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <LogoutIcon color="error" />
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ color: "error.main" }} />
          </ListItemButton>
        </Box>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          width: "100%",
          mt: "64px",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
