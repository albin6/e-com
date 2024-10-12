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
import Brand from "./pages/admin/Brand";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import NewPassword from "./components/user/NewPassword";
import ForgotPassword from "./components/user/ForgotPassword";
import ProductDetailsPage from "./pages/user/ProductDetailsPage";
import RequireAuthentication from "./private/user/RequireAuthentication";
import ProductListingPage from "./pages/user/ProductListingPage";
import CategoryListingPage from "./pages/user/CategoryListingPage";
import BrandListingPage from "./pages/user/BrandListingPage";

function AppLayout() {
  const admin = useSelector((state) => state.admin.adminInfo);
  return (
    <Router>
      <Routes>
        {/* --------------------------------------------------- */}
        {/* --------------------  users     ------------------- */}
        {/* --------------------------------------------------- */}
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
        <Route path="/users/forgot-password" element={<ForgotPassword />} />
        <Route path="/users/reset-password/:id" element={<NewPassword />} />
        <Route
          path="/product/:id"
          element={
            <RequireAuthentication>
              <ProductDetailsPage />
            </RequireAuthentication>
          }
        />
        <Route
          path="/products/categories/:categoryId"
          element={
            <RequireAuthentication>
              <CategoryListingPage />
            </RequireAuthentication>
          }
        />
        <Route
          path="/products/brands/:brandId"
          element={
            <RequireAuthentication>
              <BrandListingPage></BrandListingPage>
            </RequireAuthentication>
          }
        />
        <Route
          path="/products/list"
          element={
            <RequireAuthentication>
              <ProductListingPage />
            </RequireAuthentication>
          }
        />
        {/* --------------------------------------------------- */}
        {/* --------------------   admin    ------------------- */}
        {/* --------------------------------------------------- */}
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
        <Route
          path="/admin/products/add-product"
          element={
            <RequireAuth>
              <AddProduct />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/products/edit-product/:productId"
          element={
            <RequireAuth>
              <EditProduct />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/brand"
          element={
            <RequireAuth>
              <Brand />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <>
      <AppLayout />
    </>
  );
}

export default App;
