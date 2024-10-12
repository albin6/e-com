import React from "react";
import { useNavigate } from "react-router-dom";

const BrandCard = ({ brand }) => {
  const navigate = useNavigate();
  return (
    <div
      className="bg-white p-3 sm:p-4 rounded-lg shadow text-center transition-transform duration-300 hover:scale-105 cursor-pointer"
      onClick={() => navigate(`/products`)}
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2 sm:mb-4 rounded-full overflow-hidden">
        <img
          src={`${import.meta.env.VITE_API_BASE_URL}/brands/${brand.logo}`}
          alt={brand.name}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="font-semibold text-sm sm:text-base text-gray-800 line-clamp-2">
        {brand.name}
      </h3>
    </div>
  );
};

export default BrandCard;
