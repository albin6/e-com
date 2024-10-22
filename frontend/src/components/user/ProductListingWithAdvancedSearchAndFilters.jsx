import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import {
  Button,
  Input,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/ui-components";

import { StarIcon } from "lucide-react";

// Sample product data
const sampleProducts = [
  {
    id: 1,
    name: "Product A",
    price: 19.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.5,
    popularity: 95,
    isNew: true,
    isFeatured: false,
  },
  {
    id: 2,
    name: "Product B",
    price: 29.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 3.8,
    popularity: 80,
    isNew: false,
    isFeatured: true,
  },
  {
    id: 3,
    name: "Product C",
    price: 39.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.2,
    popularity: 88,
    isNew: false,
    isFeatured: false,
  },
  {
    id: 4,
    name: "Product D",
    price: 49.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.7,
    popularity: 92,
    isNew: true,
    isFeatured: true,
  },
];

export default function ProductListingWithAdvancedSearchAndFilter() {
  const [products, setProducts] = useState(sampleProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("featured");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (value) => {
    setSortOption(value);
    let sortedProducts = [...products];

    switch (value) {
      case "popularity":
        sortedProducts.sort((a, b) => b.popularity - a.popularity);
        break;
      case "price-low-high":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sortedProducts.sort((a, b) => b.rating - a.rating);
        break;
      case "featured":
        sortedProducts.sort(
          (a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
        );
        break;
      case "new-arrivals":
        sortedProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case "name-asc":
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    setProducts(sortedProducts);
  };

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "popularity", label: "Popularity" },
    { value: "price-low-high", label: "Price: Low to High" },
    { value: "price-high-low", label: "Price: High to Low" },
    { value: "rating", label: "Average Rating" },
    { value: "new-arrivals", label: "New Arrivals" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
  ];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-4 md:space-y-0 md:flex md:justify-between md:items-center">
        <Input
          type="search"
          placeholder="Search products..."
          className="w-full md:w-64"
          value={searchTerm}
          onChange={handleSearch}
        />
        <div className="relative w-full md:w-64" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <span className="block truncate">
              {sortOptions.find((option) => option.value === sortOption)
                ?.label || "Sort by"}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </button>
          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
              <ul className="py-1 overflow-auto text-base max-h-60">
                {sortOptions.map((option) => (
                  <li
                    key={option.value}
                    className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-100 ${
                      sortOption === option.value
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-900"
                    }`}
                    onClick={() => {
                      handleSort(option.value);
                      setIsOpen(false);
                    }}
                  >
                    <span className="block truncate">{option.label}</span>
                    {sortOption === option.value && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <CardHeader>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent className="flex-grow">
              <CardTitle className="text-lg font-semibold mb-2">
                {product.name}
              </CardTitle>
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {product.rating.toFixed(1)}
                </span>
              </div>
              <p className="text-xl font-bold">${product.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Add to Cart</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
