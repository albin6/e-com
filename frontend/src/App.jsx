import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/user/LoginPage";
import SignupPage from "./pages/user/SignupPage";
import AdminLogin from "./pages/admin/AdminLogin";
import Homepage from "./pages/user/Homepage";
import RequireNoAuthentication from "./private/user/RequireNoAuthentication";
import { useSelector } from "react-redux";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersList from "./pages/admin/UsersList";
import Category from "./pages/admin/Category";
import ProductList from "./pages/admin/ProductList";
import RequireAuth from "./private/admin/RequireAuth";

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
        <Route
          path="/admin/users"
          element={
            <RequireAuth>
              <UsersList />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/category"
          element={
            <RequireAuth>
              <Category />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/products"
          element={
            <RequireAuth>
              <ProductList />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return <AppLayout />;
}

export default App;
