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
import CategoryProductCard from "./CategoryProductCard";
import Pagination from "./Pagination";
import FilterSection from "./FilterSection";

export default function CategoryListing() {
  const { categoryId } = useParams();
  const [brands, setBrands] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [brandExpanded, setBrandExpanded] = useState(true);
  const [osExpanded, setOsExpanded] = useState(true);
  const [ramExpanded, setRamExpanded] = useState(false);
  const [storageExpanded, setStorageExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    brand: [],
    os: [],
    ram: [],
    storage: [],
  });

  const toggleFilters = () => setFiltersOpen(!filtersOpen);

  const fetchProducts = async (currentPage, itemsPerPage, sortBy) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/api/users/get-products-of-category/${categoryId}`,
        {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            sort: sortBy,
            ...filters,
          },
        }
      );

      setProducts(response.data.products);
      setBrands(response.data.brands);
      setCategories(response.data.categories);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setIsError(error?.response?.data?.message || "An error occurred");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, itemsPerPage, sortBy);
  }, [currentPage, sortBy, categoryId, filters]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSort = (e) => {
    setSortBy(e.target.value);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (updatedFilters[filterType].includes(value)) {
        updatedFilters[filterType] = updatedFilters[filterType].filter(
          (item) => item !== value
        );
      } else {
        updatedFilters[filterType] = [...updatedFilters[filterType], value];
      }
      return updatedFilters;
    });
    setCurrentPage(1);
  };

  if (isLoading) {
    return <ProductListingShimmer />;
  }

  if (isError) {
    return (
      <Error
        error={isError}
        reset={() => fetchProducts(currentPage, itemsPerPage, sortBy)}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-6">
        <ul className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <li>
            <Link to="/">Home</Link>
          </li>
          <ChevronRight className="w-4 h-4" />
          <li>Category</li>
          <ChevronRight className="w-4 h-4" />
          <li>{products[0]?.category?.title}</li>
        </ul>
      </nav>
      <div className="flex flex-col lg:flex-row gap-8">
        <aside
          className={`lg:w-64 bg-white rounded-lg shadow-md ${
            filtersOpen ? "block" : "hidden lg:block"
          }`}
        >
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Filters</h2>
            <div className="space-y-4">
              <FilterSection
                title="Brand"
                expanded={brandExpanded}
                setExpanded={setBrandExpanded}
                options={brands.map((brand) => brand.name)}
                selectedOptions={filters.brand}
                onChange={(value) => handleFilterChange("brand", value)}
              />
              <FilterSection
                title="Operating System"
                expanded={osExpanded}
                setExpanded={setOsExpanded}
                options={["Android", "iOS", "Windows", "Other"]}
                selectedOptions={filters.os}
                onChange={(value) => handleFilterChange("os", value)}
              />
              <FilterSection
                title="RAM"
                expanded={ramExpanded}
                setExpanded={setRamExpanded}
                options={["4GB", "6GB", "8GB", "12GB", "16GB"]}
                selectedOptions={filters.ram}
                onChange={(value) => handleFilterChange("ram", value)}
              />
              <FilterSection
                title="Storage"
                expanded={storageExpanded}
                setExpanded={setStorageExpanded}
                options={["64GB", "128GB", "256GB", "512GB", "1TB"]}
                selectedOptions={filters.storage}
                onChange={(value) => handleFilterChange("storage", value)}
              />
            </div>
          </div>
        </aside>

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
                <option value="newest">Newest First</option>
                <option value="priceLowHigh">Price Low-High</option>
                <option value="priceHighLow">Price High-Low</option>
                <option value="discountHighLow">Discount High-Low</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {products.map((product) => (
              <CategoryProductCard key={product._id} product={product} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
          />
        </main>
      </div>
    </div>
  );
}
