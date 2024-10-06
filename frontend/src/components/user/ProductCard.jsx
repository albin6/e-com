import React from "react";
import { Button } from "../ui/ui-components";

const ProductCard = ({ product }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <img
      src={`/placeholder.svg?height=200&width=200`}
      alt={`Product ${product}`}
      className="w-full h-48 object-cover mb-4 rounded"
    />
    <h3 className="font-semibold mb-2">Smartphone {product}</h3>
    <p className="text-gray-600 mb-2">$999</p>
    <Button className="w-full bg-gray-900 text-white hover:bg-gray-800">
      View Details
    </Button>
  </div>
);

export default ProductCard;
