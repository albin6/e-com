import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CategoryProductCard({ product }) {
  const navigate = useNavigate();
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <div className="relative w-full h-56 flex justify-center py-3 bg-gray-800">
        <img
          src={`${import.meta.env.VITE_API_BASE_URL}/products/${
            product.variants[0].images[0]
          }`}
          alt={product.name}
          className="h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 sm:h-5 sm:w-5 ${
                i < product.rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <div>
          <div className="flex items-center justify-between">
            <span className="text-base sm:text-lg font-bold">
              ₹{product.price.toLocaleString()}
            </span>
            <div className="text-sm text-gray-600">
              <span className="line-through">
                MRP: ₹
                {(product.price / (1 - product.discount / 100)).toFixed(2)}
              </span>
            </div>
          </div>
          <div>
            <span className="text-green-600 text-sm">
              (Save ₹
              {(
                product.price / (1 - product.discount / 100) -
                product.price
              ).toFixed(2)}
              , {product.discount}% off)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryProductCard;
