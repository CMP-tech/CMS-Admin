import React, { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

import SchoolIcon from "@mui/icons-material/School";
import DashboardIcon from "@mui/icons-material/Dashboard";

import PaymentIcon from "@mui/icons-material/Payment";
import BarChartIcon from "@mui/icons-material/BarChart";

import ApartmentIcon from "@mui/icons-material/Apartment";

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
  IconButton,
  Avatar,
  Stack,
  Tooltip,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import SettingsIcon from "@mui/icons-material/Settings";

import LogoutIcon from "@mui/icons-material/Logout";

import logo from "../assets/logo-website-orange.png";
import logoSideBar from "../assets/logo-website-white.png";

const drawerWidth = 240;

const Layout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // State to manage if the drawer is "permanently" open (clicked open)
  const [isPermanentlyOpen, setIsPermanentlyOpen] = useState(false);
  // State to manage if the mouse is currently hovering over the drawer
  const [isHovering, setIsHovering] = useState(false);

  // The actual 'open' state for the drawer will be true if it's permanently open,
  // or if it's not permanently open but the user is hovering.
  const open = isPermanentlyOpen || (isHovering && !isPermanentlyOpen);

  const currentPath = location.pathname;

  const handleDrawerOpen = () => {
    setIsPermanentlyOpen(true);
  };

  const handleDrawerClose = () => {
    setIsPermanentlyOpen(false);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    // Optionally close the drawer if it's not permanently open after navigation
    // if (!isPermanentlyOpen) {
    //   setIsHovering(false);
    // }
  };

  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "JD",
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
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              component="img"
              sx={{
                height: 40,
              }}
              alt="Logo"
              src={logoSideBar}
            />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        open={open} // Now derived from isPermanentlyOpen and isHovering
        onMouseEnter={handleMouseEnter} // Add mouse enter event
        onMouseLeave={handleMouseLeave} // Add mouse leave event
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            whiteSpace: "nowrap",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            ...(open
              ? {
                  overflowX: "hidden",
                  width: drawerWidth,
                }
              : {
                  overflowX: "hidden",
                  width: theme.spacing(7),
                  [theme.breakpoints.up("sm")]: {
                    width: theme.spacing(9),
                  },
                }),
            display: "flex",
            flexDirection: "column",
            height: "100%",
            background: "#fff8e6",
          },
        }}
      >
        {/* Drawer header with logo */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: open ? "space-between" : "center",
            p: 2,
          }}
        >
          {open && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                component="img"
                sx={{
                  height: 40,
                }}
                alt="Logo"
                src={logo}
              />
            </Box>
          )}
          {/* Show a placeholder logo when collapsed if you prefer */}
          {!open && (
            <Box
              component="img"
              sx={{
                height: 32,
                width: 32,
              }}
              alt="Logo"
              src={logoSideBar}
            />
          )}
          {/* Close button only visible when drawer is open */}
          {open && (
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          )}
        </Box>
        <Divider />
        <List sx={{ flexGrow: 0 }}>
          {menuItems.map((item, index) => {
            const isActive =
              currentPath === item.path ||
              (item.path !== "/" && currentPath.startsWith(item.path));

            return (
              <ListItem
                key={item.text}
                disablePadding
                sx={{ display: "block" }}
              >
                <ListItemButton
                  onClick={() => handleMenuItemClick(item.path)}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
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
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: isActive ? "primary.main" : "inherit",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      opacity: open ? 1 : 0,
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

        {/* Spacer to push profile to bottom */}
        <Box sx={{ flexGrow: 1 }} />

        <Divider />

        {/* User profile and logout section */}
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {open ? (
            <>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  {userData.avatar}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" noWrap>
                    {userData.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {userData.email}
                  </Typography>
                </Box>
              </Box>
              <ListItemButton
                sx={{
                  borderRadius: 1,
                  justifyContent: "flex-start",
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <LogoutIcon color="error" />
                </ListItemIcon>
                <ListItemText primary="Logout" sx={{ color: "error.main" }} />
              </ListItemButton>
            </>
          ) : (
            <Stack spacing={2} alignItems="center">
              <Tooltip title={userData.email} placement="right">
                <Avatar sx={{ bgcolor: "primary.main", cursor: "pointer" }}>
                  {userData.avatar}
                </Avatar>
              </Tooltip>
              <Tooltip title="Logout" placement="right">
                <IconButton color="error">
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          )}
        </Box>
      </Drawer>

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          width: "100%",
          mt: "64px", // To avoid content being hidden under AppBar
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
