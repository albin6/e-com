import React from "react";

function CategoryCard({ category }) {
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <category.icon className="w-12 h-12 text-gray-800 mb-4" />
      <h3 className="text-lg font-semibold">{category.name}</h3>
    </div>
  );
}

export default CategoryCard;
