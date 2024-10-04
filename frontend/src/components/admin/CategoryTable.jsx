import React, { useState } from "react";
import { Switch } from "@headlessui/react";
import EditCategoryModal from "./EditCategoryModal";

import {
  useCategoryList,
  useCategoryListMutation,
} from "../../hooks/CustomHooks";

import {
  updateCategory,
  updateCategoryStatus,
} from "../../utils/category/categoryCRUD";

function CategoryTable() {
  const { data, error, isLoading } = useCategoryList(updateCategory);
  const { mutate: editCategory } = useCategoryListMutation(updateCategory);
  const { mutate: editCategoryStatus } =
    useCategoryListMutation(updateCategoryStatus);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const handleUpdate = (updatedCategory) => {
    console.log(
      "updated category id type => ",
      updatedCategory._id,
      typeof updatedCategory._id
    );
    editCategory(updatedCategory);
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const toggleCategoryStatus = (id) => {
    editCategoryStatus(id);
  };

  if (isLoading) {
    return <h2>Loading..</h2>;
  }

  if (error) {
    return <h2>Error..</h2>;
  }

  return (
    <>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-left">ID</th>
            <th className="border p-2 text-left">Title</th>
            <th className="border p-2 text-center">Status</th>
            <th className="border p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.categories_data.map((category) => (
            <tr key={category._id} className="border-b">
              <td className="border p-2">{category._id}</td>
              <td className="border p-2">{category.title}</td>
              <td className="border p-2 text-center">
                <Switch
                  checked={category.status}
                  onChange={() => toggleCategoryStatus(category._id)}
                  className={`${
                    category.status ? "bg-gray-800" : "bg-gray-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                  <span className="sr-only">
                    {category.status ? "Unlist category" : "List category"}
                  </span>
                  <span
                    className={`${
                      category.status ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                  />
                </Switch>
              </td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => openEditModal(category)}
                  className="px-2 py-1 rounded mr-2 bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <EditCategoryModal
          category={editingCategory}
          onUpdate={handleUpdate}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

export default CategoryTable;
