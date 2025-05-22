import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FlightClassIcon from "@mui/icons-material/FlightClass";
import SchoolIcon from '@mui/icons-material/School'; // Import a suitable icon for Academic Year
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
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleIcon from "@mui/icons-material/People";
import logo from "../assets/logo-website-orange.png";
import logoSideBar from "../assets/logo-website-white.png";
// Sidebar width
const drawerWidth = 240;

const Layout = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Determine active route from location
  const currentPath = location.pathname;

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
  };

  // Mock user data
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "JD",
  };

  // Menu items for the sidebar with paths
  const menuItems = [
    { text: "Home", icon: <HomeIcon />, path: "/" },
    { text: "Classes", icon: <FlightClassIcon />, path: "/classes" },
    { text: "Students", icon: <PeopleIcon />, path: "/student" },
  // Added Academic Year
    { text: "Academic Year", icon: <SchoolIcon />, path: "/academic-year" },
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
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
                //   width: 40,
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
        open={open}
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
                  //   width: 40,
                }}
                alt="Logo"
                src={logo}
              />
            </Box>
          )}
          {!open && (
            <Box
              component="img"
              sx={{
                height: 32,
                width: 32,
              }}
              alt="Logo"
              src="https://via.placeholder.com/32"
            />
          )}
          {open && (
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          )}
        </Box>
        <Divider />
        <List sx={{ flexGrow: 0 }}>
          {menuItems.map((item, index) => {
            // Check if current path matches this menu item's path
            // Also handle nested paths (e.g. /student/123 should highlight the Students menu)
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
          //   flexGrow: 1,
          //   p: 3,
          //   width: { sm: `calc(100% - ${open ? drawerWidth : 72}px)` },
          //   ml: { sm: open ? `${drawerWidth}px` : `72px` },
          width: "100%",
          mt: "64px", // To avoid content being hidden under AppBar
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;