import React from "react";
import { Button } from "../ui/ui-components";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  return (
    <div
      className="bg-white p-4 rounded-lg shadow"
      onClick={() => navigate(`/products/${product._id}`)}
    >
      <img
        src={`${import.meta.env.VITE_API_BASE_URL}/products/${
          product.variants[0].images[0]
        }`}
        alt={`Product ${product.name}`}
        className="w-full h-48 object-cover mb-4 rounded cursor-pointer"
      />
      <h3 className="font-semibold mb-2 cursor-pointer">{product.name}</h3>
      <p className="text-gray-600 mb-2 cursor-pointer">₹{product.price}</p>
      <Button className="w-full bg-gray-900 text-white hover:bg-gray-800 cursor-pointer">
        View Details
      </Button>
    </div>
  );
};

export default ProductCard;
