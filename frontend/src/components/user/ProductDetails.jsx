import React from "react";
import { useParams } from "react-router-dom";
import {
  Heart,
  Share2,
  Play,
  ChevronDown,
  ChevronUp,
  MapPin,
} from "lucide-react";
import { useUserProduct } from "../../hooks/CustomHooks";
import { fetchProduct } from "../../utils/products/userProductListing";

function ProductDetails() {
  const { id } = useParams();
  const { data, isError, isLoading } = useUserProduct(fetchProduct(id));
  console.log(data);

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>Error...</h2>;
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 p-4 md:p-8">
      <nav className="mb-6">
        <ul className="flex items-center space-x-2 text-sm text-gray-600">
          <li>Phones & Wearables</li>
          <ChevronUp className="w-4 h-4 rotate-90" />
          <li>Mobile Phones</li>
          <ChevronUp className="w-4 h-4 rotate-90" />
          <li>Android Phones</li>
        </ul>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2">
          <div className="relative aspect-square mb-4">
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}/products/${
                data.variants[0].images[0]
              }`}
              alt="SAMSUNG Galaxy S24 Ultra 5G"
              className="w-full h-full object-cover rounded-lg border border-gray-200"
            />
          </div>
          <div className="flex space-x-2 mb-4 overflow-x-auto">
            {data.variants[0].images.map((path) => (
              <div
                key={path}
                className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center border border-gray-200"
              >
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}/products/${path}`}
                  width={80}
                  height={80}
                  className="rounded-md"
                />
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              id="compare"
              className="rounded bg-white border-gray-300"
            />
            <label htmlFor="compare" className="text-sm">
              Compare
            </label>
            <button className="text-sm bg-gray-100 px-4 py-2 rounded-full flex items-center space-x-2 text-gray-800 border border-gray-300">
              <span className="material-icons text-lg">store</span>
              <span>Connect to Store</span>
            </button>
          </div>
        </div>

        <div className="lg:w-1/2">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {data.name} ({data.variants[0].ram} RAM,{" "}
              {data.variants[0].storage}, {data.variants[0].color})
            </h1>
            <div className="flex space-x-4">
              <Heart className="w-6 h-6 text-gray-600" />
              <Share2 className="w-6 h-6 text-gray-600" />
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <span className="text-gray-700">2.3★</span>
            <span className="text-sm text-gray-700">(3 Ratings)</span>
          </div>

          <div className="mb-6">
            <span className="text-3xl font-bold text-gray-900">
              ₹{data.price}.00
            </span>
            <span className="text-sm text-gray-600 ml-2">
              (Incl. all Taxes)
            </span>
            <div className="text-sm text-gray-600">
              <span className="line-through">MRP: ₹134,999.00</span>
              <span className="text-gray-700 ml-2">
                (Save ₹13,000, {data.discount}% off)
              </span>
            </div>
          </div>

          <div className="bg-gray-100 rounded-lg p-4 mb-6 border border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="w-5 h-5 text-gray-700" />
              <span className="font-bold text-gray-900">
                Delivery at: Mumbai, 400049.
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Will be delivered by 11 October 2024.
            </p>
          </div>

          <div className="bg-gray-100 rounded-lg p-4 mb-6 border border-gray-200">
            <h2 className="font-bold mb-2 text-gray-900">Key Features</h2>
            <ul className="list-disc list-inside text-sm space-y-2 text-gray-700">
              <li>
                Display: {data.specifications.display.size},{" "}
                {data.specifications.display.resolution},{" "}
                {data.specifications.display.type}
              </li>
              <li>
                Memory: {data.variants[0].ram} RAM, {data.variants[0].storage}{" "}
                ROM
              </li>
              <li>Processor: {data.specifications.processor}</li>
              <li>
                Camera: {data.specifications.camera.rear} Rear &{" "}
                {data.specifications.camera.front} Front Camera
              </li>
              <li>
                Battery: {data.specifications.battery} mAh with USB Type-C
                Charging
              </li>
              <li>Operating System: {data.specifications.os}</li>
            </ul>
          </div>

          <div className="mb-6">
            <h2 className="font-bold mb-2 text-gray-900">Brand Color</h2>
            <div className="flex flex-wrap gap-2">
              {data.variants.map((variant) => (
                <button
                  key={variant.sku}
                  className={`px-4 py-2 rounded-full text-sm ${"bg-gray-500 text-white"}`}
                >
                  {variant.color}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="font-bold mb-2 text-gray-900">RAM</h2>
            <div className="flex flex-wrap gap-2">
              {data.variants.map((variant) => (
                <button
                  key={variant.sku}
                  className="px-4 py-2 rounded-full text-sm bg-gray-500 text-white"
                >
                  {variant.ram}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="font-bold mb-2 text-gray-900">Internal Storage</h2>
            <div className="flex flex-wrap gap-2">
              {data.variants.map((variant) => (
                <button
                  key={variant.sku}
                  className="px-4 py-2 rounded-full text-sm bg-gray-500 text-white"
                >
                  {variant.storage}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="font-bold mb-2 text-gray-900">Description</h2>
            <div className="flex flex-wrap gap-2">
              <p>{data.description}</p>
            </div>
          </div>

          <div className="flex space-x-4">
            <button className="flex-1 bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-600 transition-colors">
              Buy Now
            </button>
            <button className="flex-1 bg-white text-gray-500 font-bold py-3 rounded-lg border border-gray-500 hover:bg-blue-50 transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
