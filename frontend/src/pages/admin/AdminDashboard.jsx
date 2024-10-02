import React from "react";
import Header from "../../components/admin/Header";
import Dashboard from "../../components/admin/Dashboard";
import Sidebar from "../../components/admin/Sidebar";

function AdminDashboard() {
  return (
    <>
      <Header />
      <Sidebar />
      <Dashboard />
    </>
  );
}

export default AdminDashboard;
