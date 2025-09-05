// pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
  Stack,
  Container,
  Grid,
  Avatar,
  Chip,
  IconButton,
  LinearProgress,
  Divider,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  Language as LanguageIcon,
  Category as CategoryIcon,
  Article as ArticleIcon,
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats] = useState({
    posts: { count: 1247, change: "+12%", trend: "up" },
    languages: { count: 28, change: "+3", trend: "up" },
    categories: { count: 45, change: "+5", trend: "up" },
    views: { count: 8924, change: "+18%", trend: "up" },
  });

  const [latestActivities] = useState([
    {
      id: 1,
      type: "post",
      title: "Getting Started with React Hooks",
      user: "John Doe",
      avatar: "JD",
      time: "2 hours ago",
      status: "published",
      category: "Tutorial",
      language: "English",
    },
    {
      id: 2,
      type: "language",
      title: "Spanish language added",
      user: "Maria Garcia",
      avatar: "MG",
      time: "4 hours ago",
      status: "active",
      category: "Language",
      language: "Spanish",
    },
    {
      id: 3,
      type: "category",
      title: "Machine Learning category created",
      user: "Alex Chen",
      avatar: "AC",
      time: "1 day ago",
      status: "active",
      category: "Technology",
      language: "English",
    },
    {
      id: 4,
      type: "post",
      title: "Understanding TypeScript Generics",
      user: "Sarah Johnson",
      avatar: "SJ",
      time: "2 days ago",
      status: "draft",
      category: "Programming",
      language: "English",
    },
    {
      id: 5,
      type: "post",
      title: "CSS Grid Layout Masterclass",
      user: "Mike Wilson",
      avatar: "MW",
      time: "3 days ago",
      status: "published",
      category: "Design",
      language: "English",
    },
  ]);

  const StatCard = ({ title, count, change, trend, icon, color }) => (
    <Card
      elevation={0}
      sx={{
        borderRadius: "20px",
        border: "1px solid #e2e8f0",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
          borderColor: color,
        },
      }}
    >
      <CardContent sx={{ p: 3, position: "relative" }}>
        {/* Background decoration */}
        <Box
          sx={{
            position: "absolute",
            top: -10,
            right: -10,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: `${color}15`,
            opacity: 0.6,
          }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ flex: 1, zIndex: 1 }}>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontWeight: 500,
                fontSize: "0.9rem",
                mb: 1,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {title}
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: "#1e293b",
                mb: 2,
                fontSize: "2.5rem",
              }}
            >
              {count.toLocaleString()}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                label={change}
                size="small"
                sx={{
                  background: trend === "up" ? "#dcfce7" : "#fef2f2",
                  color: trend === "up" ? "#166534" : "#dc2626",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  height: "24px",
                  borderRadius: "8px",
                  "& .MuiChip-label": {
                    px: 1.5,
                  },
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "#64748b",
                  fontSize: "0.8rem",
                }}
              >
                vs last month
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              p: 1.5,
              borderRadius: "16px",
              background: `${color}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const ActivityItem = ({ activity }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 2,
        borderRadius: "16px",
        transition: "all 0.2s ease",
        cursor: "pointer",
        "&:hover": {
          bgcolor: "#f8fafc",
          transform: "translateX(4px)",
        },
      }}
    >
      <Avatar
        sx={{
          bgcolor:
            activity.type === "post"
              ? "#3b82f6"
              : activity.type === "language"
              ? "#10b981"
              : "#8b5cf6",
          color: "white",
          fontWeight: 600,
          fontSize: "0.9rem",
          width: 40,
          height: 40,
        }}
      >
        {activity.avatar}
      </Avatar>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            color: "#1e293b",
            mb: 0.5,
            fontSize: "0.95rem",
          }}
        >
          {activity.title}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "#64748b",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              fontSize: "0.8rem",
            }}
          >
            <PersonIcon sx={{ fontSize: 14 }} />
            {activity.user}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: "#64748b",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              fontSize: "0.8rem",
            }}
          >
            <ScheduleIcon sx={{ fontSize: 14 }} />
            {activity.time}
          </Typography>

          <Chip
            label={activity.status}
            size="small"
            sx={{
              height: "20px",
              fontSize: "0.7rem",
              fontWeight: 500,
              borderRadius: "6px",
              textTransform: "capitalize",
              bgcolor:
                activity.status === "published"
                  ? "#dcfce7"
                  : activity.status === "draft"
                  ? "#fef3c7"
                  : "#e0e7ff",
              color:
                activity.status === "published"
                  ? "#166534"
                  : activity.status === "draft"
                  ? "#92400e"
                  : "#3730a3",
            }}
          />
        </Box>
      </Box>

      <IconButton
        size="small"
        sx={{
          color: "#64748b",
          "&:hover": { color: "#3b82f6", bgcolor: "#f1f5f9" },
        }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
    </Box>
  );

  // const QuickActionCard = ({ icon, title, color, onClick }) => (
  //   <Box
  //     onClick={onClick}
  //     sx={{
  //       p: 2,
  //       borderRadius: "12px",
  //       border: "1px dashed #d1d5db",
  //       textAlign: "center",
  //       cursor: "pointer",
  //       transition: "all 0.2s ease",
  //       "&:hover": {
  //         borderColor: color,
  //         bgcolor: "#f8fafc",
  //         transform: "translateY(-1px)",
  //       },
  //     }}
  //   >
  //     <Typography
  //       variant="body2"
  //       sx={{
  //         color: color,
  //         fontWeight: 600,
  //         display: "flex",
  //         alignItems: "center",
  //         justifyContent: "center",
  //         gap: 1,
  //       }}
  //     >
  //       {icon}
  //       {title}
  //     </Typography>
  //   </Box>
  // );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8fafc",
      }}
      p={3}
    >
      <Container maxWidth="xl">
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
            Dashboard
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#64748b",
              fontSize: "1.1rem",
            }}
          >
            Overview of your content management system
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Posts"
              count={stats.posts.count}
              change={stats.posts.change}
              trend={stats.posts.trend}
              color="#3b82f6"
              icon={<ArticleIcon sx={{ fontSize: 28, color: "#3b82f6" }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Languages"
              count={stats.languages.count}
              change={stats.languages.change}
              trend={stats.languages.trend}
              color="#10b981"
              icon={<LanguageIcon sx={{ fontSize: 28, color: "#10b981" }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Categories"
              count={stats.categories.count}
              change={stats.categories.change}
              trend={stats.categories.trend}
              color="#8b5cf6"
              icon={<CategoryIcon sx={{ fontSize: 28, color: "#8b5cf6" }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Views"
              count={stats.views.count}
              change={stats.views.change}
              trend={stats.views.trend}
              color="#f59e0b"
              icon={<VisibilityIcon sx={{ fontSize: 28, color: "#f59e0b" }} />}
            />
          </Grid>
        </Grid>

        {/* Latest Activity Section */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
                overflow: "hidden",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                height: "100%",
              }}
            >
              <CardContent sx={{ p: 0 }}>
                {/* Header */}
                <Box
                  sx={{
                    p: 3,
                    borderBottom: "1px solid #e2e8f0",
                    background:
                      "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#374151",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    📊 Latest Activity
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#64748b",
                      mt: 0.5,
                    }}
                  >
                    Recent posts, languages, and category updates
                  </Typography>
                </Box>

                {/* Activity List */}
                <Box sx={{ p: 1 }}>
                  <Stack spacing={0}>
                    {latestActivities.map((activity, index) => (
                      <React.Fragment key={activity.id}>
                        <ActivityItem activity={activity} />
                        {index < latestActivities.length - 1 && (
                          <Divider sx={{ mx: 3, borderColor: "#f1f5f9" }} />
                        )}
                      </React.Fragment>
                    ))}
                  </Stack>
                </Box>
              </CardContent>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              {/* Performance Card */}
              {/* <Paper
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
                      fontWeight: 600,
                      color: "#374151",
                      mb: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    📈 Performance
                  </Typography>

                  <Stack spacing={3}>
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: "#64748b", fontSize: "0.9rem" }}
                        >
                          Content Growth
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#1e293b", fontWeight: 600 }}
                        >
                          85%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={85}
                        sx={{
                          height: 8,
                          borderRadius: "4px",
                          bgcolor: "#f1f5f9",
                          "& .MuiLinearProgress-bar": {
                            background:
                              "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                            borderRadius: "4px",
                          },
                        }}
                      />
                    </Box>

                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: "#64748b", fontSize: "0.9rem" }}
                        >
                          User Engagement
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#1e293b", fontWeight: 600 }}
                        >
                          72%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={72}
                        sx={{
                          height: 8,
                          borderRadius: "4px",
                          bgcolor: "#f1f5f9",
                          "& .MuiLinearProgress-bar": {
                            background:
                              "linear-gradient(90deg, #10b981 0%, #059669 100%)",
                            borderRadius: "4px",
                          },
                        }}
                      />
                    </Box>

                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: "#64748b", fontSize: "0.9rem" }}
                        >
                          Translation Coverage
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#1e293b", fontWeight: 600 }}
                        >
                          63%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={63}
                        sx={{
                          height: 8,
                          borderRadius: "4px",
                          bgcolor: "#f1f5f9",
                          "& .MuiLinearProgress-bar": {
                            background:
                              "linear-gradient(90deg, #f59e0b 0%, #d97706 100%)",
                            borderRadius: "4px",
                          },
                        }}
                      />
                    </Box>
                  </Stack>
                </CardContent>
              </Paper> */}

              {/* Quick Actions */}
              {/* <Paper
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
                      fontWeight: 600,
                      color: "#374151",
                      mb: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    ⚡ Quick Actions
                  </Typography>

                  <Stack spacing={2}>
                    <QuickActionCard
                      icon={<ArticleIcon fontSize="small" />}
                      title="Create New Post"
                      color="#3b82f6"
                      onClick={() => navigate("/admin/posts/add")}
                    />

                    <QuickActionCard
                      icon={<LanguageIcon fontSize="small" />}
                      title="Add Language"
                      color="#10b981"
                      onClick={() => navigate("/admin/languages/add")}
                    />

                    <QuickActionCard
                      icon={<CategoryIcon fontSize="small" />}
                      title="Manage Categories"
                      color="#8b5cf6"
                      onClick={() => navigate("/admin/categories")}
                    />
                  </Stack>
                </CardContent>
              </Paper> */}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
