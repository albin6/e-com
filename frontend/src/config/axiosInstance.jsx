import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(async (config) => {
  const access_token = JSON.stringify(localStorage.getItem("access_token"));

  if (access_token) {
    config.headers["Authorization"] = `Bearer ${access_token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original_request = error.config;

    if (
      error.response.status === 401 &&
      error.response.data.message === "Not authorized, token failed" &&
      !original_request._retry
    ) {
      original_request._retry = true;

      try {
        const response = await axiosInstance.post(
          "/api/users/token",
          {},
          {
            withCredentials: true,
          }
        );

        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response?.data?.access_token}`;

        return axiosInstance(original_request);
      } catch (error) {
        console.log("Error refreshing token:", error);
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// Admin
export const adminAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

adminAxiosInstance.interceptors.request.use(async (config) => {
  const admin_access_token = JSON.parse(
    localStorage.getItem("admin_access_token")
  );

  if (admin_access_token) {
    config.headers["Authorization"] = `Bearer ${admin_access_token}`;
  }

  return config;
});

adminAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original_request = error.config;

    if (
      error.response.status === 401 &&
      error.response.data.message === "Not authorized, token failed" &&
      !original_request._retry
    ) {
      original_request._retry = true;

      try {
        const response = await adminAxiosInstance.post(
          "/api/admin/token",
          {},
          {
            withCredentials: true,
          }
        );

        adminAxiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response?.data?.access_token}`;

        return adminAxiosInstance(original_request);
      } catch (error) {
        console.log("Admin token refresh failed:", error);
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
