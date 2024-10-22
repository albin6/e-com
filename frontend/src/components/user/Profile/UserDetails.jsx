import React, { useEffect, useState } from "react";
import ProfileSidebar from "./ProfileSidebar";
import ProfileTab from "./ProfileTab";
import AddressBookTab from "../Address/AddressBookTab";
import Orders from "../my-orders/Orders";
import { axiosInstance } from "../../../config/axiosInstance";
import { toast } from "react-toastify";

const UserDetails = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    axiosInstance
      .get("/api/users/profile")
      .then((response) =>
        setUserName(
          response.data.user_data.first_name +
            " " +
            response.data.user_data.last_name
        )
      )
      .catch((error) => console.log(error));
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="flex-1 p-6">
            <header className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold">
                  {activeTab === "profile" && "Your Details"}
                  {activeTab === "addresses" && "Address Book"}
                  {activeTab === "orders" && "Your Orders"}
                </h1>
                <p className="text-sm text-gray-600">
                  {activeTab === "profile" && "Personal Information"}
                  {activeTab === "addresses" && "Manage your addresses"}
                  {activeTab === "orders" && "Manage your orders"}
                </p>
              </div>

              {userName && (
                <p className="text-sm text-gray-600">
                  Welcome!{" "}
                  <span className="text-gray-800 text-base font-medium">
                    {userName}
                  </span>
                </p>
              )}
            </header>
            {activeTab === "profile" && <ProfileTab />}
            {activeTab === "addresses" && <AddressBookTab />}
            {activeTab === "orders" && <Orders />}
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
