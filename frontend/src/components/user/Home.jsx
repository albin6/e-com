import React, { useEffect, useState } from "react";
import { Button, Input } from "../ui/ui-components";
import { ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import ProductCard from "./ProductCard";
import BrandCard from "./BrandCard";
import { useUserProductsData } from "../../hooks/CustomHooks";
import { fetchProductsDetails } from "../../utils/products/userProductListing";

const Home = () => {
  const navigate = useNavigate();
  const { data, isError, isLoading } =
    useUserProductsData(fetchProductsDetails);
  const [products, setProducts] = useState(null);
  const [categories, setCategories] = useState(null);
  const [brands, setBrands] = useState(null);

  useEffect(() => {
    setProducts(data?.products);
    setCategories(data?.categories);
    setBrands(data?.brands);
  }, [data]);

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>Error...</h2>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white">
      {/* Banner Section */}
      <section className="relative h-[500px] bg-gray-900 text-white">
        <img
          src="/placeholder.svg?height=500&width=1920"
          alt="Latest smartphone"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Discover the Latest Smartphones
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Explore our wide range of cutting-edge devices
          </p>
          <Button className="bg-white text-gray-900 hover:bg-gray-200">
            Shop Now
          </Button>
        </div>
      </section>

      {/* Category List */}
      <section className="py-16 px-4 md:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Shop by Category</h2>
          <Link to="/products/list">
            <Button
              variant="outline"
              className="bg-gray-900 hover:bg-gray-600 text-white"
            >
              View All
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {categories &&
            categories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
        </div>
      </section>

      {/* Flagship Phones */}
      <section className="py-16 px-4 md:px-8 bg-gray-100">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Flagship Phones</h2>
          <Link to="/products/list">
            <Button
              variant="outline"
              className="bg-gray-900 hover:bg-gray-600 text-white"
            >
              View All
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {products &&
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
        </div>
      </section>

      {/* Featured Phones */}
      <section className="py-16 px-4 md:px-8 bg-gray-100">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Smartphones</h2>
          <Link to="/products/list">
            <Button
              variant="outline"
              className="bg-gray-900 hover:bg-gray-600 text-white"
            >
              View All
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {products &&
            products.map((product) =>
              product?.isFeatured ? (
                <ProductCard key={product._id} product={product} />
              ) : null
            )}
        </div>
      </section>

      {/* Shop by Brand */}
      <section className="py-16 px-4 md:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Shop by Brand</h2>
          <Link to="/products/list">
            <Button
              variant="outline"
              className="bg-gray-900 hover:bg-gray-600 text-white"
            >
              View All
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {brands &&
            brands.map((brand) => <BrandCard key={brand._id} brand={brand} />)}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-4 md:px-8 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="mb-8">
            Subscribe to our newsletter for the latest smartphone deals and
            updates
          </p>
          <form className="flex flex-col md:flex-row gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-grow bg-white text-gray-900"
            />
            <Button
              type="submit"
              className="bg-white text-gray-900 hover:bg-gray-200"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Upgrade Your Phone?
          </h2>
          <p className="text-xl mb-8">
            Explore our wide selection of smartphones and find your perfect
            match
          </p>
          <Button className="bg-gray-800 hover:bg-gray-700 text-white text-center">
            Shop All Smartphones <ChevronRight className="ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
