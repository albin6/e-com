import React from "react";
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import UserListing from "../../components/admin/UserListing";

function UsersList() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <UserListing />
        </main>
      </div>
    </div>
  );
}

export default UsersList;
