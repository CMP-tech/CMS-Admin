import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import Layout from "./components/Layout";
import Post from "./pages/Posts/Post";
import AddPostPage from "./pages/Posts/AddPost";
import CategoriesPage from "./pages/Category/category";
import AddCategoryPage from "./pages/Category/AddCategory";
import LanguagesPage from "./pages/Languages/Languages";
import AddLanguagePage from "./pages/Languages/AddLanguage";
import ProfilePage from "./pages/Profile/Profile";
import ChangePasswordPage from "./pages/Profile/ChangePassowrd";
import LoginPage from "./pages/auth/login";
import ForgotPassword from "./pages/auth/forgetPassword";
import GeneralSettings from "./pages/settings/General";
import ReadingSettings from "./pages/settings/Reading";
import GoogleAnalyticsSettings from "./pages/settings/GoogleAnalytics";
import Dashboard from "./pages/Dashboard/dashboard";
import PrivacyPage from "./pages/settings/Privacy";
import { ToastContainer } from "react-toastify";
import EditLanguagePage from "./pages/Languages/EditLanguage";
import EditCategoryPage from "./pages/Category/EditCategory";
import EditPostPage from "./pages/Posts/EditPost";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected/Admin routes */}
          <Route path="/" element={<Layout />}>
            <Route path="admin/dashboard" element={<Dashboard />} />
            <Route path="admin/posts" element={<Post />} />
            <Route path="admin/posts/add" element={<AddPostPage />} />
            <Route path="admin/posts/edit/:postId" element={<EditPostPage />} />
            <Route path="admin/categories" element={<CategoriesPage />} />
            <Route path="admin/category/add" element={<AddCategoryPage />} />
            <Route
              path="admin/categories/edit/:id"
              element={<EditCategoryPage />}
            />
            <Route path="admin/languages" element={<LanguagesPage />} />
            <Route path="admin/language/add" element={<AddLanguagePage />} />
            <Route
              path="admin/languages/edit/:id"
              element={<EditLanguagePage />}
            />
            <Route path="admin/profile" element={<ProfilePage />} />
            <Route
              path="admin/change-password"
              element={<ChangePasswordPage />}
            />

            {/* Settings */}
            <Route path="settings/general" element={<GeneralSettings />} />
            <Route path="settings/reading" element={<ReadingSettings />} />
            <Route path="settings/privacy" element={<PrivacyPage />} />
            <Route
              path="settings/google-analytics"
              element={<GoogleAnalyticsSettings />}
            />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
