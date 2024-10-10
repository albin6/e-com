import React from "react";
import { Smartphone } from "lucide-react";

const CategoryCard = ({ category }) => (
  <div className="bg-white p-4 rounded-lg shadow text-center flex flex-col justify-center">
    <Smartphone className="mx-auto w-8 h-8 text-gray-800" />
    <h3 className="font-semibold mt-2 text-gray-800">{category.title}</h3>
  </div>
);

export default CategoryCard;
