import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import Layout from "./components/Layout";
// import Home from "./pages/Home";
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

function App() {
  return (
    <>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={<Layout />}>
            {/* <Route path="home" element={<Home />} /> */}
            <Route path="admin/posts" element={<Post />} />
            <Route path="admin/posts/add" element={<AddPostPage />} />
            <Route path="admin/categories" element={<CategoriesPage />} />
            <Route path="admin/category/add" element={<AddCategoryPage />} />
            <Route path="admin/languages" element={<LanguagesPage />} />
            <Route path="admin/language/add" element={<AddLanguagePage />} />
            <Route path="admin/profile" element={<ProfilePage />} />
            <Route
              path="admin/change-password"
              element={<ChangePasswordPage />}
            />
            {/* Add more routes as needed */}
          </Route>

          {/* Add private routes here if needed */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
