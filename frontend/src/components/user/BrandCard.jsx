import React from "react";

const BrandCard = ({ brand }) => (
  <div className="bg-white p-4 rounded-lg shadow text-center">
    <img src={brand.logo} alt={brand.name} className="w-20 h-20 mx-auto mb-4" />
    <h3 className="font-semibold">{brand.name}</h3>
  </div>
);

export default BrandCard;
