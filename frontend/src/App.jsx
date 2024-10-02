import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/user/LoginPage";
import SignupPage from "./pages/user/SignupPage";
import AdminLogin from "./components/admin/AdminLogin";
import Homepage from "./pages/user/Homepage";
import RequireNoAuthentication from "./private/RequireNoAuthentication";

function AppLayout() {
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
        <Route path="/admin" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

function App() {
  return <AppLayout />;
}

export default App;
