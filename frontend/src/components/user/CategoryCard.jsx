import React from "react";

const CategoryCard = ({ category }) => (
  <div className="bg-white p-4 rounded-lg shadow text-center">
    <category.icon className="w-12 h-12 mx-auto mb-4" />
    <h3 className="font-semibold">{category.name}</h3>
  </div>
);

export default CategoryCard;
