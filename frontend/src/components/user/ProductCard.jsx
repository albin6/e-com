import React from "react";
import { Button } from "../ui/Button";

function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={`/placeholder.svg?height=300&width=300&text=Smartphone ${product}`}
        alt={`Smartphone ${product}`}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">Smartphone {product}</h3>
        <p className="text-gray-600 mb-4">
          High-performance device with advanced features.
        </p>
        <Button className="w-full bg-gray-800 text-white hover:bg-gray-700">
          View Details
        </Button>
      </div>
    </div>
  );
}

export default ProductCard;
