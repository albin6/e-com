import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/user/LoginPage";
import SignupPage from "./pages/user/SignupPage";
import AdminLogin from "./pages/admin/AdminLogin";
import Homepage from "./pages/user/Homepage";
import RequireNoAuthentication from "./private/RequireNoAuthentication";
import { useSelector } from "react-redux";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersList from "./pages/admin/UsersList";
import Category from "./pages/admin/Category";
import ProductList from "./pages/admin/ProductList";

function AppLayout() {
  const admin = useSelector((state) => state.admin.adminInfo);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route
          path="/login"
          element={
            <RequireNoAuthentication>
              <LoginPage />
            </RequireNoAuthentication>
          }
        />
        <Route
          path="/signup"
          element={
            <RequireNoAuthentication>
              <SignupPage />
            </RequireNoAuthentication>
          }
        />
        <Route
          path="/admin"
          element={admin ? <AdminDashboard /> : <AdminLogin />}
        />
        <Route path="/admin/users" element={<UsersList />} />
        <Route path="/admin/category" element={<Category />} />
        <Route path="/admin/products" element={<ProductList />} />
      </Routes>
    </Router>
  );
}

function App() {
  return <AppLayout />;
}

export default App;
