import React from "react";

function BrandCard({ brand }) {
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <img
        src={brand.logo}
        alt={brand.name}
        className="w-12 h-12 object-contain mb-4"
      />
      <h3 className="text-lg font-semibold">{brand.name}</h3>
    </div>
  );
}

export default BrandCard;
