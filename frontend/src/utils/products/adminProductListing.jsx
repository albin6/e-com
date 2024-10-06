import { adminAxiosInstance } from "../../config/axiosInstance";

export const fetchProductsData = async () => {
  const response = await adminAxiosInstance.get("/api/admin/products");
  return response.data;
};

export const addNewProduct = async (productData) => {
  const response = await adminAxiosInstance.post(
    "/api/admin/products",
    productData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  console.log(response.data);
};
