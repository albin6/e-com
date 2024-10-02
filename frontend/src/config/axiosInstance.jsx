import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  const access_token = localStorage.getItem("access_token");

  if (access_token) {
    config.headers["Authorization"] = `Bearer ${access_token}`;
  }

  return config;
});

// interceptor for refreshing access token if it expires

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
          "/token",
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
        console.log(error);
      }
    }
  }
);
