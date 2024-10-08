import React, { useState } from "react";
import {
  Star,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const phones = [
  {
    id: 1,
    name: "CMF BY NOTHING PHONE 1",
    price: 16599,
    oldPrice: 18599,
    rating: 5,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 2,
    name: "CMF BY NOTHING PHONE 1",
    price: 16599,
    oldPrice: 18599,
    rating: 5,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 3,
    name: "CMF BY NOTHING PHONE 1",
    price: 16599,
    oldPrice: 18599,
    rating: 5,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 4,
    name: "CMF BY NOTHING PHONE 1",
    price: 16599,
    oldPrice: 18599,
    rating: 5,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 5,
    name: "CMF BY NOTHING PHONE 1",
    price: 16599,
    oldPrice: 18599,
    rating: 5,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 6,
    name: "CMF BY NOTHING PHONE 1",
    price: 16599,
    oldPrice: 18599,
    rating: 5,
    image: "/placeholder.svg?height=300&width=300",
  },
  // Add more phone objects to test pagination
  ...Array.from({ length: 18 }, (_, i) => ({
    id: i + 7,
    name: `CMF BY NOTHING PHONE ${i + 2}`,
    price: 16599,
    oldPrice: 18599,
    rating: 5,
    image: "/placeholder.svg?height=300&width=300",
  })),
];

const ProductListing = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [brandExpanded, setBrandExpanded] = useState(true);
  const [osExpanded, setOsExpanded] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const toggleFilters = () => setFiltersOpen(!filtersOpen);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = phones.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(phones.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-8">
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
                    {[
                      "Apple",
                      "Samsung",
                      "Nothing",
                      "Vivo",
                      "Google",
                      "Motorola",
                      "Redmi",
                      "Lenovo",
                      "Honor",
                    ].map((brand) => (
                      <label key={brand} className="flex items-center">
                        <input type="checkbox" className="form-checkbox" />
                        <span className="ml-2">{brand}</span>
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
                          <span className="ml-2">{os}</span>
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
              <select className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                <option>Sort By</option>
                <option>Popularity</option>
                <option>Newest First</option>
                <option>Price Low-High</option>
                <option>Price High-Low</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((phone) => (
              <div
                key={phone.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={phone.image}
                  alt={phone.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{phone.name}</h3>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < phone.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">
                      ₹{phone.price.toLocaleString()}
                    </span>
                    <span className="text-sm line-through text-gray-500">
                      ₹{phone.oldPrice.toLocaleString()}
                    </span>
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
                className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`px-4 py-2 border border-gray-300 text-sm font-medium ${
                    currentPage === index + 1
                      ? "bg-blue-50 border-blue-500 text-blue-600"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductListing;
