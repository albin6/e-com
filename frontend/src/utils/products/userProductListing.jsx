import { axiosInstance } from "../../config/axiosInstance";

export const fetchProductsDetails = async () => {
  const response = await axiosInstance.get("/api/users//get-product-details");
  return response.data;
};
