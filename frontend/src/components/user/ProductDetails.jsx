import React, { useState, useEffect } from "react";
import {
  Heart,
  Share2,
  ChevronUp,
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Checkbox,
  Label,
  Card,
  CardContent,
  Button,
  RadioGroup,
  RadioGroupItem,
} from "../ui/ui-components";
import { useParams } from "react-router-dom";
import { useUserProduct } from "../../hooks/CustomHooks";
import { fetchProduct } from "../../utils/products/userProductListing";

function ProductDetails() {
  const { id } = useParams();
  const { data: product, isLoading, error } = useUserProduct(fetchProduct(id));
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  console.log(product);

  useEffect(() => {
    if (product && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error: {error.message}
      </div>
    );
  if (!product)
    return (
      <div className="flex items-center justify-center h-screen">
        No product found
      </div>
    );

  const handleVariantChange = (sku) => {
    const newVariant = product.variants.find((v) => v.sku === sku);
    if (newVariant) {
      setSelectedVariant(newVariant);
      console.log(newVariant);
      setCurrentImageIndex(0);
    }
  };

  const nextImage = () => {
    if (selectedVariant) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % selectedVariant.images.length
      );
    }
  };

  const prevImage = () => {
    if (selectedVariant) {
      setCurrentImageIndex(
        (prevIndex) =>
          (prevIndex - 1 + selectedVariant.images.length) %
          selectedVariant.images.length
      );
    }
  };

  const averageRating =
    product.reviews.reduce((acc, review) => acc + review.rating, 0) /
    product.reviews.length;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8">
      <nav className="mb-6">
        <ul className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <li>{product.category.name}</li>
          <ChevronRight className="w-4 h-4" />
          <li>{product.brand.name}</li>
        </ul>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          {selectedVariant && (
            <Card className="overflow-hidden">
              <CardContent className="p-0 relative aspect-square">
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}/products/${
                    selectedVariant.images[currentImageIndex]
                  }`}
                  alt={`${product.name} - ${selectedVariant.color}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-between p-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevImage}
                    className="rounded-full bg-white/80 hover:bg-white"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextImage}
                    className="rounded-full bg-white/80 hover:bg-white"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          {selectedVariant && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {selectedVariant.images.map((image, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-20 h-20 p-0 rounded-lg overflow-hidden"
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={`${
                      import.meta.env.VITE_API_BASE_URL
                    }/products/${image}`}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            {selectedVariant && (
              <p className="text-lg text-gray-600">
                {selectedVariant.ram} RAM, {selectedVariant.storage},{" "}
                {selectedVariant.color}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(averageRating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({product.reviews.length} Ratings)
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Heart className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-6 w-6" />
              </Button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <span className="text-3xl font-bold text-gray-900">
              ₹{product.price.toLocaleString()}.00
            </span>
            <span className="text-sm text-gray-600 ml-2">
              (Incl. all Taxes)
            </span>
            <div className="text-sm text-gray-600 mt-1">
              <span className="line-through">
                MRP: ₹
                {(product.price / (1 - product.discount / 100)).toFixed(2)}
              </span>
              <span className="text-green-600 ml-2">
                (Save ₹
                {(
                  product.price / (1 - product.discount / 100) -
                  product.price
                ).toFixed(2)}
                , {product.discount}% off)
              </span>
            </div>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-gray-600" />
                <span className="font-semibold">
                  Delivery at: Mumbai, 400049
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Will be delivered by{" "}
                {new Date(
                  Date.now() + 7 * 24 * 60 * 60 * 1000
                ).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h2 className="font-bold text-lg mb-3">Key Features</h2>
              <ul className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <li>
                  <span className="font-semibold">Display:</span>{" "}
                  {product.specifications.display.size},{" "}
                  {product.specifications.display.resolution},{" "}
                  {product.specifications.display.type}
                </li>
                {selectedVariant && (
                  <li>
                    <span className="font-semibold">Memory:</span>{" "}
                    {selectedVariant.ram} RAM, {selectedVariant.storage} ROM
                  </li>
                )}
                <li>
                  <span className="font-semibold">Processor:</span>{" "}
                  {product.specifications.processor}
                </li>
                <li>
                  <span className="font-semibold">Camera:</span>{" "}
                  {product.specifications.camera.rear} Rear,{" "}
                  {product.specifications.camera.front} Front
                </li>
                <li>
                  <span className="font-semibold">Battery:</span>{" "}
                  {product.specifications.battery}
                </li>
                <li>
                  <span className="font-semibold">OS:</span>{" "}
                  {product.specifications.os}
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div>
              <h2 className="font-bold text-lg mb-2">Color</h2>
              <RadioGroup
                defaultValue={selectedVariant?.sku}
                onValueChange={handleVariantChange}
                className="flex flex-wrap gap-2"
              >
                {product.variants.map((variant) => (
                  <div key={variant.sku}>
                    <RadioGroupItem
                      value={variant.sku}
                      id={`color-${variant.sku}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`color-${variant.sku}`}
                      className="flex items-center justify-center px-4 py-2 rounded-full text-sm bg-gray-100 text-gray-800 peer-data-[state=checked]:bg-blue-600 peer-data-[state=checked]:text-white hover:bg-gray-200 transition-colors"
                    >
                      {variant.color}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <h2 className="font-bold text-lg mb-2">RAM</h2>
              <RadioGroup
                defaultValue={selectedVariant?.ram}
                onValueChange={(value) =>
                  handleVariantChange(
                    product.variants.find((v) => v.ram === value)?.sku || ""
                  )
                }
                className="flex flex-wrap gap-2"
              >
                {Array.from(new Set(product.variants.map((v) => v.ram))).map(
                  (ram) => (
                    <div key={ram}>
                      <RadioGroupItem
                        value={ram}
                        id={`ram-${ram}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`ram-${ram}`}
                        className="flex items-center justify-center px-4 py-2 rounded-full text-sm bg-gray-100 text-gray-800 peer-data-[state=checked]:bg-blue-600 peer-data-[state=checked]:text-white hover:bg-gray-200 transition-colors"
                      >
                        {ram}
                      </Label>
                    </div>
                  )
                )}
              </RadioGroup>
            </div>

            <div>
              <h2 className="font-bold text-lg mb-2">Internal Storage</h2>
              <RadioGroup
                defaultValue={selectedVariant?.storage}
                onValueChange={(value) =>
                  handleVariantChange(
                    product.variants.find((v) => v.storage === value)?.sku || ""
                  )
                }
                className="flex flex-wrap gap-2"
              >
                {Array.from(
                  new Set(product.variants.map((v) => v.storage))
                ).map((storage) => (
                  <div key={storage}>
                    <RadioGroupItem
                      value={storage}
                      id={`storage-${storage}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`storage-${storage}`}
                      className="flex items-center justify-center px-4 py-2 rounded-full text-sm bg-gray-100 text-gray-800 peer-data-[state=checked]:bg-blue-600 peer-data-[state=checked]:text-white hover:bg-gray-200 transition-colors"
                    >
                      {storage}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <div>
            <h2 className="font-bold text-lg mb-2">Description</h2>
            <p className="text-sm text-gray-600">{product.description}</p>
          </div>

          <div className="flex gap-4">
            <Button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white">
              Buy Now
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-gray-600 text-gray-600 hover:bg-blue-50"
            >
              Add to Cart
            </Button>
          </div>

          <div>
            <h2 className="font-bold text-lg mb-4">Customer Reviews</h2>
            <div className="space-y-4">
              {product.reviews.map((review, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">{review.name}</span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
