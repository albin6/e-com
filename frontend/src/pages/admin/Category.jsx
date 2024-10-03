import React, { useState } from "react";
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import AddCategoryForm from "../../components/admin/AddCategoryForm";
import CategoryTable from "../../components/admin/CategoryTable";
import EditCategoryModal from "../../components/admin/EditCategoryModal";

// Mock initial categories
const initialCategories = [
  { id: 1, title: "Flip Phone", isListed: true },
  { id: 2, title: "Gaming Phone", isListed: false },
  { id: 3, title: "Clothing", isListed: true },
];

function Category() {
  const [categories, setCategories] = useState(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const addCategory = (newCategory) => {
    setCategories([...categories, { ...newCategory, id: Date.now() }]);
  };

  const deleteCategory = (id) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  const updateCategory = (updatedCategory) => {
    setCategories(
      categories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const toggleCategoryStatus = (id) => {
    setCategories(
      categories.map((category) =>
        category.id === id
          ? { ...category, isListed: !category.isListed }
          : category
      )
    );
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Category Management</h1>
          <AddCategoryForm onAddCategory={addCategory} />
          <CategoryTable
            categories={categories}
            onDelete={deleteCategory}
            onEdit={openEditModal}
            onToggleStatus={toggleCategoryStatus}
          />
          {isModalOpen && (
            <EditCategoryModal
              category={editingCategory}
              onUpdate={updateCategory}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Category;
