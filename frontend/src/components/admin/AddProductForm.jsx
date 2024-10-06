import React, { useState, useCallback, useEffect } from "react";
import { PlusCircle, X, Upload, Crop, ShoppingBag } from "lucide-react";
import Cropper from "react-easy-crop";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Textarea,
  Label,
  Input,
  Button,
} from "../ui/ui-components";
import {
  useProductsData,
  useProductsDataMutation,
} from "../../hooks/CustomHooks";
import { addNewProduct } from "../../utils/products/adminProductListing";

export default function Component() {
  const { data, isError, isLoading } = useProductsData();
  const [brandData, setBrandData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [productData, setProductData] = useState([]);
  const { mutate: addProduct } = useProductsDataMutation(addNewProduct);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    category: "",
    brand: "",
    stock: "",
    tags: [],
    variations: [{ attribute: "", terms: [{ term: "", sku: "" }] }],
  });
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [croppingImageIndex, setCroppingImageIndex] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    setBrandData(data?.brand);
    setCategoryData(data?.category);
    setProductData(data?.products);
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      setFormData((prevData) => ({
        ...prevData,
        tags: [...prevData.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (indexToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      tags: prevData.tags.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleVariationChange = (index, field, value) => {
    const newVariations = [...formData.variations];
    newVariations[index][field] = value;
    setFormData((prevData) => ({
      ...prevData,
      variations: newVariations,
    }));
  };

  const handleTermChange = (variationIndex, termIndex, field, value) => {
    const newVariations = [...formData.variations];
    newVariations[variationIndex].terms[termIndex][field] = value;
    setFormData((prevData) => ({
      ...prevData,
      variations: newVariations,
    }));
  };

  const addVariation = () => {
    setFormData((prevData) => ({
      ...prevData,
      variations: [
        ...prevData.variations,
        { attribute: "", terms: [{ term: "", sku: "" }] },
      ],
    }));
  };

  const removeVariation = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      variations: prevData.variations.filter((_, i) => i !== index),
    }));
  };

  const addTerm = (variationIndex) => {
    const newVariations = [...formData.variations];
    newVariations[variationIndex].terms.push({ term: "", sku: "" });
    setFormData((prevData) => ({
      ...prevData,
      variations: newVariations,
    }));
  };

  const removeTerm = (variationIndex, termIndex) => {
    const newVariations = [...formData.variations];
    newVariations[variationIndex].terms = newVariations[
      variationIndex
    ].terms.filter((_, i) => i !== termIndex);
    setFormData((prevData) => ({
      ...prevData,
      variations: newVariations,
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setImages((prevImages) => [
      ...prevImages,
      ...files.map((file) => ({ file, preview: URL.createObjectURL(file) })),
    ]);
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const startCropping = (index) => {
    setCroppingImageIndex(index);
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        images[croppingImageIndex].preview,
        croppedAreaPixels,
        0
      );
      const newImages = [...images];
      newImages[croppingImageIndex] = {
        ...newImages[croppingImageIndex],
        preview: croppedImage,
        file: await fetch(croppedImage).then((r) => r.blob()),
      };
      setImages(newImages);
      setCroppingImageIndex(null);
    } catch (e) {
      console.error(e);
    }
  }, [croppingImageIndex, images, croppedAreaPixels]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Product name is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (formData.price && isNaN(formData.price))
      newErrors.price = "Price must be a number";
    if (
      formData.discount &&
      (isNaN(formData.discount) ||
        formData.discount < 0 ||
        formData.discount > 100)
    ) {
      newErrors.discount = "Discount must be a number between 0 and 100";
    }
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.brand) newErrors.brand = "Brand is required";
    if (!formData.stock) newErrors.stock = "Stock is required";
    if (formData.stock && isNaN(formData.stock))
      newErrors.stock = "Stock must be a number";

    formData.variations.forEach((variation, index) => {
      if (!variation.attribute) {
        newErrors[`variation${index}`] = "Attribute is required";
      }
      variation.terms.forEach((term, termIndex) => {
        if (!term.term) {
          newErrors[`variation${index}term${termIndex}`] = "Term is required";
        }
        if (!term.sku) {
          newErrors[`variation${index}sku${termIndex}`] = "SKU is required";
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "variations" || key === "tags") {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      images.forEach((image, index) => {
        formDataToSend.append(`images`, image.file);
      });

      console.log("Form data:", formDataToSend);
      addProduct(formDataToSend);
      console.log("Product added successfully");
      setFormData({
        name: "",
        description: "",
        price: "",
        discount: "",
        category: "",
        brand: "",
        stock: "",
        tags: [],
        variations: [{ attribute: "", terms: [{ term: "", sku: "" }] }],
      });
      setImages([]);
      setError("");
    } catch (error) {
      console.error("Error adding product:", error);
      setError("An error occurred while adding the product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <h2>Loading....</h2>;
  }

  if (isError) {
    return <h2>Error....</h2>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">
            <ShoppingBag className="w-10 h-10 mx-auto mb-2" />
            Add New Product
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 text-center text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Product Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  className={`mt-1 block w-full rounded-md ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="stock"
                  className="text-sm font-medium text-gray-700"
                >
                  Stock
                </Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="Enter stock quantity"
                  className={`mt-1 block w-full rounded-md ${
                    errors.stock ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.stock && (
                  <p className="text-red-500 text-xs mt-1">{errors.stock}</p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="brand"
                  className="text-sm font-medium text-gray-700"
                >
                  Brand
                </Label>
                <select
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md ${
                    errors.brand ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Brand</option>
                  {brandData &&
                    brandData.map((brand) => (
                      <option key={brand._id} value={brand.name}>
                        {brand.name}
                      </option>
                    ))}
                </select>
                {errors.brand && (
                  <p className="text-red-500 text-xs mt-1">{errors.brand}</p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="category"
                  className="text-sm font-medium text-gray-700"
                >
                  Category
                </Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md ${
                    errors.category ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Category</option>
                  {categoryData &&
                    categoryData.map((category) => (
                      <option key={category._id} value={category.title}>
                        {category.title}
                      </option>
                    ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="price"
                  className="text-sm font-medium text-gray-700"
                >
                  Price
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  className={`mt-1 block w-full rounded-md ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.price && (
                  <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="discount"
                  className="text-sm font-medium text-gray-700"
                >
                  Discount (%)
                </Label>
                <Input
                  id="discount"
                  name="discount"
                  type="number"
                  value={formData.discount}
                  onChange={handleInputChange}
                  placeholder="Enter discount percentage"
                  className={`mt-1 block w-full rounded-md ${
                    errors.discount ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.discount && (
                  <p className="text-red-500 text-xs mt-1">{errors.discount}</p>
                )}
              </div>
            </div>

            <div className="mb-4 flex flex-col">
              <Label
                htmlFor="description"
                className="text-sm font-medium text-gray-700"
              >
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Enter product description"
                className={`mt-1 block w-full rounded-md ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="mb-4">
              <Label
                htmlFor="tags"
                className="text-sm font-medium text-gray-700"
              >
                Tags
              </Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 px-2 py-1 rounded-full text-sm flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
              <Input
                id="tags"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Enter tags and press Enter"
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </div>

            <div className="mb-4">
              <Label className="text-sm font-medium text-gray-700 mb-2">
                Product Images
              </Label>
              <div className="mt-1 flex items-center">
                <Label
                  htmlFor="image-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Images
                  <Input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    onChange={handleImageUpload}
                    multiple
                    accept="image/*"
                  />
                </Label>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.preview}
                      alt={`Product ${index + 1}`}
                      className="h-24 w-full object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      onClick={() => removeImage(index)}
                      variant="destructive"
                      size="icon"
                      className="absolute top-0 right-0 -mt-2 -mr-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      onClick={() => startCropping(index)}
                      variant="secondary"
                      size="icon"
                      className="absolute bottom-0 right-0 mb-1 mr-1"
                    >
                      <Crop className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {croppingImageIndex !== null && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <Card className="w-96">
                  <CardContent className="p-4">
                    <div className="relative h-64 mb-4">
                      <Cropper
                        image={images[croppingImageIndex].preview}
                        crop={crop}
                        zoom={zoom}
                        aspect={4 / 3}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                      />
                    </div>
                    <div className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCroppingImageIndex(null)}
                      >
                        Cancel
                      </Button>
                      <Button type="button" onClick={handleCropSave}>
                        Save Crop
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">
                Variations
              </Label>
              {formData.variations.map((variation, index) => (
                <Card key={index} className="mb-4">
                  <CardContent className="p-4">
                    <div className="mb-4">
                      <Label
                        htmlFor={`variation-${index}-attribute`}
                        className="text-sm font-medium text-gray-700"
                      >
                        Attribute
                      </Label>
                      <Input
                        id={`variation-${index}-attribute`}
                        value={variation.attribute}
                        onChange={(e) =>
                          handleVariationChange(
                            index,
                            "attribute",
                            e.target.value
                          )
                        }
                        placeholder="e.g., Color, Size"
                        className={`mt-1 block w-full rounded-md ${
                          errors[`variation${index}`]
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors[`variation${index}`] && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[`variation${index}`]}
                        </p>
                      )}
                    </div>
                    {variation.terms.map((term, termIndex) => (
                      <div
                        key={termIndex}
                        className="flex items-center space-x-2 mt-2"
                      >
                        <Input
                          value={term.term}
                          onChange={(e) =>
                            handleTermChange(
                              index,
                              termIndex,
                              "term",
                              e.target.value
                            )
                          }
                          placeholder="Term"
                          className={`flex-1 ${
                            errors[`variation${index}term${termIndex}`]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        <Input
                          value={term.sku}
                          onChange={(e) =>
                            handleTermChange(
                              index,
                              termIndex,
                              "sku",
                              e.target.value
                            )
                          }
                          placeholder="SKU"
                          className={`flex-1 ${
                            errors[`variation${index}sku${termIndex}`]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        <Button
                          type="button"
                          onClick={() => removeTerm(index, termIndex)}
                          variant="destructive"
                          size="icon"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {(errors[`variation${index}term0`] ||
                      errors[`variation${index}sku0`]) && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[`variation${index}term0`] ||
                          errors[`variation${index}sku0`]}
                      </p>
                    )}
                    <div className="flex w-full justify-between mt-2">
                      <Button
                        type="button"
                        onClick={() => addTerm(index)}
                        variant="outline"
                        size="sm"
                        className="bg-gray-800 hover:bg-gray-600 text-white flex items-center"
                      >
                        <PlusCircle className="w-4 h-4 mr-2" /> Add Term
                      </Button>
                      {index > 0 && (
                        <Button
                          type="button"
                          onClick={() => removeVariation(index)}
                          variant="destructive"
                          size="sm"
                          className="text-red-600"
                        >
                          Remove Variation
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button
                type="button"
                onClick={addVariation}
                className="bg-gray-800 hover:bg-gray-600 text-white flex items-center"
                variant="outline"
              >
                <PlusCircle className="w-5 h-5 mr-2" /> Add Variation
              </Button>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gray-800 hover:bg-gray-600 text-white"
            >
              {isSubmitting ? "Adding Product..." : "Add Product"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
  const image = new Image();
  image.src = imageSrc;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  canvas.width = safeArea;
  canvas.height = safeArea;

  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate(getRadianAngle(rotation));
  ctx.translate(-safeArea / 2, -safeArea / 2);

  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  );

  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.putImageData(
    data,
    0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x,
    0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y
  );

  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      resolve(URL.createObjectURL(file));
    }, "image/jpeg");
  });
}

function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180;
}
