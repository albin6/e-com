import React, { useState } from "react";

// Mock data for demonstration
const initialUsers = [
  {
    userId: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phoneNumber: "123-456-7890",
    blocked: false,
  },
  {
    userId: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    phoneNumber: "098-765-4321",
    blocked: true,
  },
  {
    userId: 3,
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob@example.com",
    phoneNumber: "555-555-5555",
    blocked: false,
  },
];

export default function UserListing() {
  const [users, setUsers] = useState(initialUsers);

  const toggleBlockStatus = (userId) => {
    setUsers(
      users.map((user) =>
        user.userId === userId ? { ...user, blocked: !user.blocked } : user
      )
    );
  };

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
          {users.map((user) => (
            <tr
              key={user.userId}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {user.userId}
              </td>
              <td className="py-3 px-6 text-left">{user.firstName}</td>
              <td className="py-3 px-6 text-left">{user.lastName}</td>
              <td className="py-3 px-6 text-left">{user.email}</td>
              <td className="py-3 px-6 text-left">{user.phoneNumber}</td>
              <td className="py-3 px-6 text-center">
                <button
                  onClick={() => toggleBlockStatus(user.userId)}
                  className={`py-1 px-3 rounded-full text-xs font-bold ${
                    user.blocked
                      ? "bg-green-200 text-green-700 hover:bg-green-300"
                      : "bg-red-200 text-red-700 hover:bg-red-300"
                  }`}
                >
                  {user.blocked ? "Unblock" : "Block"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
