import { adminAxiosInstance } from "../../config/axiosInstance";

export const fetchCategories = async () => {
  const response = await adminAxiosInstance.get("/api/admin/categories");
  return response.data;
};

export const submitCategoryForm = async (newCategory) => {
  const response = await adminAxiosInstance.post(
    "/api/admin/categories",
    newCategory
  );
  return response.data;
};

export const updateCategory = async (updatedCategory) => {
  const response = await adminAxiosInstance.put(
    `/api/admin/categories/${updateCategory._id}`,
    updatedCategory
  );
};

export const updateCategoryStatus = async (categoryId) => {
  const response = await adminAxiosInstance.patch(
    "/api/admin/categories",
    updatedCategory
  );
};
