import { adminAxiosInstance } from "../config/axiosInstance";

async function fetchUsers() {
  try {
    const response = await adminAxiosInstance.get("/api/admin/users-list");
    console.log(response.data);
    return response.data.users;
  } catch (error) {
    console.log(error);
  }
}

export default fetchUsers;
