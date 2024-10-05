import React from "react";
import { useState, useEffect } from "react";

const ProductDetails = ({ product }) => {
  const [isSoldOut, setIsSoldOut] = useState(false);
  const [inStock, setInStock] = useState(true); // Example states for handling stock status

  // Sample product data will be passed in the 'product' prop
  useEffect(() => {
    if (product?.stock === 0) {
      setInStock(false);
    }
    if (product?.status === "Sold out") {
      setIsSoldOut(true);
    }
  }, [product?.stock, product?.status]);

  return (
    <div className="container mx-auto py-8">
      {/* Breadcrumbs */}
      <nav className="text-sm mb-4">
        <a href="/" className="text-gray-500 hover:text-gray-700">
          Home
        </a>{" "}
        /
        <a href="/category" className="text-gray-500 hover:text-gray-700">
          {" "}
          {product?.category}{" "}
        </a>{" "}
        /<span className="text-gray-700"> {product?.name} </span>
      </nav>

      {/* Product Title and Image */}
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2">
          <img
            src={product?.images[0]}
            alt={product?.name}
            className="w-full rounded-md shadow-md"
          />
        </div>

        {/* Product Details */}
        <div className="md:w-1/2 md:pl-8">
          <h1 className="text-3xl font-bold mb-2">{product?.name}</h1>

          {/* Rating */}
          <div className="flex items-center mb-4">
            <span className="text-yellow-500">&#9733;</span> {/* Star Icon */}
            <span className="text-yellow-500">&#9733;</span>
            <span className="text-yellow-500">&#9733;</span>
            <span className="text-yellow-500">&#9733;</span>
            <span className="text-gray-300">&#9733;</span> {/* Empty star */}
            <p className="ml-2 text-sm text-gray-500">(100 reviews)</p>
          </div>

          {/* Price */}
          <div className="text-2xl font-bold text-green-600 mb-2">
            ${product?.price}
          </div>

          {/* Discount / Coupon */}
          <p className="text-sm text-red-600 mb-2">
            Coupon applied: Save 10% on your order!
          </p>

          {/* Stock Status */}
          {isSoldOut ? (
            <p className="text-xl font-bold text-red-500">Sold Out</p>
          ) : inStock ? (
            <p className="text-lg font-semibold text-green-500">In Stock</p>
          ) : (
            <p className="text-lg font-semibold text-orange-500">
              Out of Stock
            </p>
          )}

          {/* Product Specifications */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Product Highlights</h2>
            <ul className="list-disc list-inside text-gray-700">
              <li>Brand: {product?.brand}</li>
              <li>RAM: {product?.variations[0]?.terms[0]?.sku}</li>
              <li>Storage: {product?.specifications?.storage}</li>
              <li>Battery: {product?.specifications?.battery}</li>
              <li>Camera: {product?.specifications?.camera}</li>
              {/* Add more specs as needed */}
            </ul>
          </div>

          {/* Reviews */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Reviews</h2>
            <p className="text-sm text-gray-500">
              "This phone has great features!"
            </p>
            <p className="text-sm text-gray-500">"Amazing performance!"</p>
            {/* Display more reviews */}
          </div>

          {/* Related Products */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Related Products</h2>
            <div className="flex space-x-4">
              <div className="w-1/3">
                <img
                  src="/related-product-1.jpg"
                  alt="Related Product"
                  className="w-full rounded-md"
                />
                <p className="text-sm text-center mt-2">Related Product 1</p>
              </div>
              <div className="w-1/3">
                <img
                  src="/related-product-2.jpg"
                  alt="Related Product"
                  className="w-full rounded-md"
                />
                <p className="text-sm text-center mt-2">Related Product 2</p>
              </div>
              {/* Add more related products */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
