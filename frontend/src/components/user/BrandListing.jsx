import React, { useState, useEffect } from "react";
import {
  Star,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { axiosInstance } from "../../config/axiosInstance";
import { Link, useParams } from "react-router-dom";
import Error from "../Error";
import ProductListingShimmer from "../ui/ProductListingShimmer";

const BrandListing = () => {
  const { brandId } = useParams();
  const [brands, setBrands] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [brandExpanded, setBrandExpanded] = useState(true);
  const [osExpanded, setOsExpanded] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const itemsPerPage = 3;
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const toggleFilters = () => setFiltersOpen(!filtersOpen);

  const fetchProducts = async (currentPage, itemsPerPage, sortBy) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/api/users/get-products-of-brand/${brandId}`,
        {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            sort: sortBy,
          },
        }
      );

      setProducts(response?.data?.products);
      setBrands(response?.data?.brands);
      setCategories(response?.data?.categories);
      setTotalPages(response?.data?.totalPages);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setIsError(error?.response?.data?.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, itemsPerPage, sortBy);
  }, [currentPage, sortBy]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSort = (e) => {
    setSortBy(e.target.value);
    // You would typically call an API to sort the data here
    // For now, we'll just set the state
  };

  if (isLoading) {
    return <ProductListingShimmer />;
  }

  if (isError) {
    return <Error error={isError} reset={fetchProducts} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-6">
        <ul className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <li>
            <Link to={"/"}>Home</Link>
          </li>
          <ChevronRight className="w-4 h-4" />
          <li>Top Brands</li>
          <ChevronRight className="w-4 h-4" />
          <li>{products[0].brand.name}</li>
        </ul>
      </nav>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <aside
          className={`lg:w-64 bg-white rounded-lg shadow-md ${
            filtersOpen ? "block" : "hidden lg:block"
          }`}
        >
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Filters</h2>
            <div className="space-y-4">
              <div>
                <button
                  className="flex items-center justify-between w-full font-semibold mb-2"
                  onClick={() => setBrandExpanded(!brandExpanded)}
                  aria-expanded={brandExpanded}
                >
                  Brand
                  {brandExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                {brandExpanded && (
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <label key={brand._id} className="flex items-center">
                        <input type="checkbox" className="form-checkbox" />
                        <span className="ml-2 text-sm">{brand.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <button
                  className="flex items-center justify-between w-full font-semibold mb-2"
                  onClick={() => setOsExpanded(!osExpanded)}
                  aria-expanded={osExpanded}
                >
                  Operating System
                  {osExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                {osExpanded && (
                  <div className="space-y-2">
                    {["Android", "Blackberry", "iOS", "Windows", "Symbian"].map(
                      (os) => (
                        <label key={os} className="flex items-center">
                          <input type="checkbox" className="form-checkbox" />
                          <span className="ml-2 text-sm">{os}</span>
                        </label>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <main className="flex-1">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold">Products</h2>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button
                onClick={toggleFilters}
                className="lg:hidden flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                Filters
              </button>
              <select
                className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                value={sortBy}
                onChange={handleSort}
              >
                <option value="discountHighLow">
                  Sort By: Discount High-Low
                </option>
                <option value="newest">Sort By: Newest First</option>
                <option value="priceLowHigh">Sort By: Price Low-High</option>
                <option value="priceHighLow">Sort By: Price High-Low</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="relative w-full h-56 flex justify-center py-3 bg-gray-800">
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}/products/${
                      product.variants[0].images[0]
                    }`}
                    alt={product.name}
                    className=" h-full object-cover"
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
                          {(
                            product.price /
                            (1 - product.discount / 100)
                          ).toFixed(2)}
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
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <nav className="inline-flex rounded-md shadow">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 sm:px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  aria-hidden="true"
                />
              </button>
              <div className="hidden sm:flex">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`px-4 py-2 border border-gray-300 text-sm font-medium ${
                      currentPage === index + 1
                        ? "bg-gray-50 border-gray-500 text-gray-600"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <span className="sm:hidden px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2 sm:px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Next</span>
                <ChevronRight
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  aria-hidden="true"
                />
              </button>
            </nav>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BrandListing;
