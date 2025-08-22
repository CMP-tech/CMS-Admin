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
} from "@mui/material";

import logo from "../assets/logo-cms.png";

const drawerWidth = 240;

const Layout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [openMenus, setOpenMenus] = useState({});

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
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* <Avatar sx={{ bgcolor: "primary.main" }}>A</Avatar> */}
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {/* <Typography variant="subtitle2" color="inherit" noWrap>
                Roshan Admin
              </Typography> */}
            </Box>
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
            justifyContent: "space-between",
            p: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box component="img" sx={{ height: 40 }} alt="Logo" src={logo} />
          </Box>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />

        {/* Menu Items */}
        <List>
          {menuItems.map((item) => {
            const isActive = currentPath === item.path;

            if (!item.children) {
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
                      justifyContent: "initial",
                      px: 2.5,
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
                <ListItem disablePadding sx={{ display: "block" }}>
                  <ListItemButton
                    onClick={() => toggleMenu(item.text)}
                    sx={{
                      minHeight: 48,
                      justifyContent: "initial",
                      px: 2.5,
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
                          sx={{ pl: 4 }}
                        >
                          <ListItemButton
                            onClick={() => handleMenuItemClick(child.path)}
                            sx={{
                              minHeight: 40,
                              px: 2.5,
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

        <Box sx={{ flexGrow: 1 }} />

        <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />

        {/* Bottom Profile + Logout */}
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "primary.main" }}>A</Avatar>
            <Box>
              <Typography variant="subtitle2" noWrap>
                Roshan Admin
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.7)" }}
                noWrap
              >
                roshan@admingmail.com
              </Typography>
            </Box>
          </Box>

          <ListItemButton
            onClick={handleLogout}
            sx={{ borderRadius: 1, justifyContent: "flex-start" }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <LogoutIcon sx={{ color: "red" }} />
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ color: "red" }} />
          </ListItemButton>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ width: "100%", mt: "64px", padding: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
