import React from "react";
import { Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();
  return (
    <div
      className="bg-white p-3 sm:p-4 rounded-lg shadow text-center flex flex-col justify-center transition-transform duration-300 hover:scale-105 cursor-pointer"
      onClick={() => navigate(`/products/list/${category._id}`)}
    >
      <Smartphone className="mx-auto w-6 h-6 sm:w-8 sm:h-8 text-gray-800" />
      <h3 className="font-semibold mt-2 text-sm sm:text-base text-gray-800 line-clamp-2">
        {category.title}
      </h3>
    </div>
  );
};

export default CategoryCard;
