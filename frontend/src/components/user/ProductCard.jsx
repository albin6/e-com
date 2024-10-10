import { Heart, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();
  return (
    <div
      className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
      onClick={() => navigate(`/products/${product._id}`)}
    >
      <div className="relative h-64">
        <img
          src={`${import.meta.env.VITE_API_BASE_URL}/products/${
            product.variants[0].images[0]
          }`}
          alt="Vivo Y28e 5G"
          className="w-full h-auto object-cover"
        />
        <div className="absolute top-2 right-2 flex space-x-2">
          <button className="p-1 bg-white rounded-full shadow">
            <Heart className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          {product.name} ({product.variants[0].ram} RAM,{" "}
          {product.variants[0].storage}, {product.variants[0].color})
        </h2>
        <div className="flex items-center mb-2">
          <span className="text-yellow-500 mr-1">★</span>
          <span className="text-gray-600 text-sm">2.8 (4)</span>
        </div>
        <div className="flex items-baseline mb-2">
          <span className="text-2xl font-bold text-gray-800">
            ₹{product?.price}
          </span>
          <span className="text-sm text-gray-500 line-through ml-2">
            ₹12,999
          </span>
          <span className="text-sm text-green-600 ml-2">
            {product?.discount}% Off
          </span>
        </div>
        <div className="text-sm text-gray-600">
          <span className="inline-block mr-1">
            <svg
              className="w-4 h-4 inline-block"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </span>
          Standard Delivery by Fri, 11th Oct
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
