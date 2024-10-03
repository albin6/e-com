import React, { useState, useEffect, useCallback } from "react";
import fetchUsers from "../../utils/fetchUsers";
import { adminAxiosInstance } from "../../config/axiosInstance";

export default function UserListing() {
  const [usersList, setUsersList] = useState([]);
  const [filteredUserList, setFilteredUserList] = useState([]);

  useEffect(() => {
    fetchUsers()
      .then((users) => {
        setUsersList(users);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    setFilteredUserList(usersList);
    console.log("filtered list updated");
  }, [usersList]);

  const toggleBlockStatus = async (userId) => {
    try {
      const response = await adminAxiosInstance.patch("/api/admin/users-list", {
        userId,
      });

      // Update the list of users in the state
      const updatedUserData = response.data.updated_user_data;

      setUsersList((prevUsersList) => {
        return prevUsersList.map((user) =>
          user._id === updatedUserData._id
            ? { ...user, is_blocked: updatedUserData.is_blocked }
            : user
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  console.log("UserListing Component rendered..........");
  console.log("usersList: ", usersList);
  console.log("filteredUserList: ", filteredUserList);
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">User Listing</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">User ID</th>
            <th className="py-3 px-6 text-left">First Name</th>
            <th className="py-3 px-6 text-left">Last Name</th>
            <th className="py-3 px-6 text-left">Email</th>
            <th className="py-3 px-6 text-left">Phone Number</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {filteredUserList.map((user) => (
            <tr
              key={user._id}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {user._id}
              </td>
              <td className="py-3 px-6 text-left">{user.first_name}</td>
              <td className="py-3 px-6 text-left">{user.last_name}</td>
              <td className="py-3 px-6 text-left">{user.email}</td>
              <td className="py-3 px-6 text-left">{user.phone_number}</td>
              <td className="py-3 px-6 text-center">
                <button
                  onClick={() => toggleBlockStatus(user._id)}
                  className={`py-1 px-3 rounded-full text-xs font-bold ${
                    user.is_blocked
                      ? "bg-green-200 text-green-700 hover:bg-green-300"
                      : "bg-red-200 text-red-700 hover:bg-red-300"
                  }`}
                >
                  {user.is_blocked ? "Unblock" : "Block"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
