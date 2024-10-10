import React, { useEffect, useState } from "react";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useProductsData } from "../../hooks/CustomHooks";
import { fetchProductsData } from "../../utils/products/adminProductListing";

export default function ProductListing() {
  const { data, isError, isLoading } = useProductsData(fetchProductsData);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    if (data) {
      setProducts(data.products || []);
      setCategories(data.categories || []);
      setBrands(data.brands || []);
    }
  }, [data]);

  const handleAddProduct = () => {
    navigate("/admin/products/add-product");
  };

  const handleEditProduct = (product) => {
    navigate(`/admin/products/edit-product/${product._id}`);
  };

  const handleDeleteProduct = (productId) => {
    // Implement delete functionality here
    console.log("Delete product:", productId);
  };

  const filteredProducts = products
    .filter(
      (product) =>
        filterCategory === "All" || product.category?.title === filterCategory
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "stock")
        return (a.variants[0]?.stock || 0) - (b.variants[0]?.stock || 0);
      return 0;
    });

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>Error loading products. Please try again later.</h2>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Product Listing</h1>
        <button
          onClick={handleAddProduct}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add New Product
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <label htmlFor="category-filter" className="font-medium">
            Filter by Category:
          </label>
          <select
            id="category-filter"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border rounded-md p-2"
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category.title}>
                {category.title}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-4">
          <label htmlFor="sort-by" className="font-medium">
            Sort by:
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-md p-2"
          >
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="stock">Stock</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Image</th>
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Category</th>
              <th className="py-2 px-4 border-b text-left">Brand</th>
              <th className="py-2 px-4 border-b text-left">Price</th>
              <th className="py-2 px-4 border-b text-left">Stock</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}/products/${
                      product.variants[0]?.images[0]
                    }`}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="py-2 px-4">{product.name}</td>
                <td className="py-2 px-4">{product.category?.title}</td>
                <td className="py-2 px-4">{product.brand?.name}</td>
                <td className="py-2 px-4">₹{product.price.toFixed(2)}</td>
                <td className="py-2 px-4">{product.variants[0]?.stock || 0}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
