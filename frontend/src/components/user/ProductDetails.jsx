import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useUserProduct } from "../../hooks/CustomHooks";
import { fetchProduct } from "../../utils/products/userProductListing";
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
} from "../ui/ui-components";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useMouseOverZoom } from "../../hooks/useMouseOverZoom";

// Corrected useMouseOverZoom hook

function ProductDetails() {
  const { id } = useParams();
  const { data: product, isLoading, error } = useUserProduct(fetchProduct(id));
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedRam, setSelectedRam] = useState("");
  const [selectedStorage, setSelectedStorage] = useState("");
  const [availableRam, setAvailableRam] = useState([]);
  const [availableStorage, setAvailableStorage] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (product && product.variants.length > 0) {
      const firstVariant = product.variants[0];
      setSelectedColor(firstVariant.color);
      setSelectedRam(firstVariant.ram);
      setSelectedStorage(firstVariant.storage);
      updateAvailableOptions(firstVariant.color);
    }
  }, [product]);

  const updateAvailableOptions = (color) => {
    const variantsForColor = product.variants.filter((v) => v.color === color);
    const ramOptions = [...new Set(variantsForColor.map((v) => v.ram))];
    setAvailableRam(ramOptions);
    setSelectedRam(ramOptions[0]);

    const storageOptions = [
      ...new Set(
        variantsForColor
          .filter((v) => v.ram === ramOptions[0])
          .map((v) => v.storage)
      ),
    ];
    setAvailableStorage(storageOptions);
    setSelectedStorage(storageOptions[0]);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    updateAvailableOptions(color);
    setCurrentImageIndex(0);
  };

  const handleRamChange = (ram) => {
    setSelectedRam(ram);
    const storageOptions = [
      ...new Set(
        product.variants
          .filter((v) => v.color === selectedColor && v.ram === ram)
          .map((v) => v.storage)
      ),
    ];
    setAvailableStorage(storageOptions);
    setSelectedStorage(storageOptions[0]);
  };

  const handleStorageChange = (storage) => {
    setSelectedStorage(storage);
  };

  const getSelectedVariant = () => {
    return product.variants.find(
      (v) =>
        v.color === selectedColor &&
        v.ram === selectedRam &&
        v.storage === selectedStorage
    );
  };

  const nextImage = () => {
    const selectedVariant = getSelectedVariant();
    if (selectedVariant) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % selectedVariant.images.length
      );
    }
  };

  const prevImage = () => {
    const selectedVariant = getSelectedVariant();
    if (selectedVariant) {
      setCurrentImageIndex(
        (prevIndex) =>
          (prevIndex - 1 + selectedVariant.images.length) %
          selectedVariant.images.length
      );
    }
  };

  const sourceRef = useRef(null);
  const targetRef = useRef(null);
  const cursorRef = useRef(null);

  // Use the zoom hook
  const { isActive, zoomBounds } = useMouseOverZoom(
    sourceRef,
    targetRef,
    cursorRef,
    50
  );

  useEffect(() => {
    // Ensure the canvas is the right size
    if (targetRef.current) {
      targetRef.current.width = 400;
      targetRef.current.height = 400;
    }
  }, []);

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

  const selectedVariant = getSelectedVariant();
  const averageRating =
    product.reviews.reduce((acc, review) => acc + review.rating, 0) /
    product.reviews.length;
  console.log(selectedVariant);
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8">
      <nav className="mb-6 ml-44">
        <ul className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <li>
            <Link to={"/"}>Home</Link>
          </li>
          <ChevronRight className="w-4 h-4" />
          <li>{product.category.title}</li>
          <ChevronRight className="w-4 h-4" />
          <li>{product.brand.name}</li>
        </ul>
      </nav>
      {/* <div ref={cursorRef} className="border absolute z-30" /> */}
      <canvas
        ref={targetRef}
        width="200"
        height="500"
        className="absolute pointer-events-none bottom-full translate-y-1/2 left-3/4 md:-translate-y-3/4 md:translate-x-0 md:bottom-16 md:left-1/2 border-8 w-2/5 h-96 z-10"
        style={{
          display: isActive ? "block" : "none",
        }}
      />
      <div className="grid gap-8 lg:grid-cols-2 mx-32">
        <div className="space-y-6 max-w-[750px] mx-auto">
          {selectedVariant && (
            <Card className="overflow-hidden">
              <CardContent className="p-0 relative aspect-square">
                <img
                  ref={sourceRef}
                  src={`${import.meta.env.VITE_API_BASE_URL}/products/${
                    selectedVariant.images[currentImageIndex]
                  }`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevImage}
                  className="absolute rounded-full bg-white/80 hover:bg-white left-0 top-80"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextImage}
                  className="absolute rounded-full bg-white/80 hover:bg-white right-0 top-80"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
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

        <div className="space-y-6 max-w-[750px] mx-auto">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              <span>{product.name} </span>
              {selectedVariant && (
                <span className="text-lg text-gray-600">
                  ({selectedVariant.ram} RAM, {selectedVariant.storage},{" "}
                  {selectedVariant.color})
                </span>
              )}
            </h1>
          </div>
          <div>
            {selectedVariant && selectedVariant?.stock == 0 && (
              <p className="text-lg text-red-600">Stock out!!!</p>
            )}
            {selectedVariant && selectedVariant?.stock <= 10 && (
              <p className="text-lg text-red-600">
                Only {selectedVariant?.stock} left!!!
              </p>
            )}
            {selectedVariant && selectedVariant?.stock > 10 && (
              <p className="text-lg text-green-600">
                {selectedVariant?.stock} left
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
                value={selectedColor}
                onValueChange={handleColorChange}
                className="flex flex-wrap gap-2"
              >
                {[...new Set(product.variants.map((v) => v.color))].map(
                  (color) => (
                    <div key={color}>
                      <RadioGroupItem
                        value={color}
                        id={`color-${color}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`color-${color}`}
                        className="flex items-center justify-center px-4 py-2 rounded-full text-sm bg-gray-100 text-gray-800 peer-data-[state=checked]:bg-gray-600 peer-data-[state=checked]:text-white hover:bg-gray-200 transition-colors"
                      >
                        {color}
                      </Label>
                    </div>
                  )
                )}
              </RadioGroup>
            </div>

            <div>
              <h2 className="font-bold text-lg mb-2">RAM</h2>
              <RadioGroup
                value={selectedRam}
                onValueChange={handleRamChange}
                className="flex flex-wrap gap-2"
              >
                {availableRam.map((ram) => (
                  <div key={ram}>
                    <RadioGroupItem
                      value={ram}
                      id={`ram-${ram}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`ram-${ram}`}
                      className="flex items-center justify-center px-4 py-2 rounded-full text-sm bg-gray-100 text-gray-800 peer-data-[state=checked]:bg-gray-600 peer-data-[state=checked]:text-white hover:bg-gray-200 transition-colors"
                    >
                      {ram}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <h2 className="font-bold text-lg mb-2">Internal Storage</h2>
              <RadioGroup
                value={selectedStorage}
                onValueChange={handleStorageChange}
                className="flex flex-wrap gap-2"
              >
                {availableStorage.map((storage) => (
                  <div key={storage}>
                    <RadioGroupItem
                      value={storage}
                      id={`storage-${storage}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`storage-${storage}`}
                      className="flex items-center justify-center px-4 py-2 rounded-full text-sm bg-gray-100 text-gray-800 peer-data-[state=checked]:bg-gray-600 peer-data-[state=checked]:text-white hover:bg-gray-200 transition-colors"
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
            <Button
              className={`flex-1 bg-gray-600 hover:bg-gray-700 text-white ${
                selectedVariant?.stock == 0 ? "cursor-not-allowed" : ""
              }`}
            >
              Buy Now
            </Button>

            <Button
              variant="outline"
              className={`flex-1 border-gray-600 text-gray-600 hover:bg-blue-50 ${
                selectedVariant?.stock == 0 ? "cursor-not-allowed" : ""
              }`}
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
