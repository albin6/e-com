import React from "react";

const BrandCard = ({ brand }) => (
  <div className="bg-white p-4 rounded-lg shadow text-center">
    <img
      src={`${import.meta.env.VITE_API_BASE_URL}/brands/${brand.logo}`}
      alt={brand.name}
      className="w-20 h-20 mx-auto mb-4 rounded-full"
    />
    <h3 className="font-semibold text-gray-800">{brand.name}</h3>
  </div>
);

export default BrandCard;
