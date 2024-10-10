import { axiosInstance } from "../../config/axiosInstance";

export const fetchProductsDetails = async () => {
  const response = await axiosInstance.get("/api/users/get-products-details");
  return response.data;
};

export const fetchProduct = (productId) => {
  return async function () {
    const response = await axiosInstance.get(
      `/api/users/get-product/${productId}`
    );
    return response.data.product;
  };
};
