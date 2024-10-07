import React, { useState, useCallback, useEffect } from "react";
import { PlusCircle, X, Upload, Crop, ShoppingBag } from "lucide-react";
import Cropper from "react-easy-crop";
import { useForm, useFieldArray, Controller } from "react-hook-form";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Textarea,
  Label,
  Input,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/ui-components";

export default function EditProductForm({ productId }) {
  const [isLoading, setIsLoading] = useState(true);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      variants: [
        {
          color: "",
          ram: "",
          storage: "",
          price: 0,
          stock: 0,
          images: [""],
          sku: "",
        },
      ],
      specifications: {
        camera: { front: "", rear: "" },
        display: { size: "", resolution: "", type: "" },
      },
      tags: [],
    },
  });
  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: "variants",
  });

  const [croppingImageIndex, setCroppingImageIndex] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Replace this with your actual API call
        const response = await fetch(`/api/products/${productId}`);
        const productData = await response.json();

        // Transform tags from array to comma-separated string
        productData.tags = productData.tags.join(", ");

        reset(productData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, reset]);

  const onSubmit = async (data) => {
    try {
      // Transform tags back to array
      data.tags = data.tags.split(",").map((tag) => tag.trim());

      // Replace this with your actual API call
      const response = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Product updated successfully");
        // Add any success handling here (e.g., showing a success message, redirecting)
      } else {
        throw new Error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      // Add error handling here (e.g., showing an error message)
    }
  };

  const handleImageUpload = (event, index) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...variantFields[index].images];
        newImages.push(reader.result);
        // Update the form data
      };
      reader.readAsDataURL(file);
    }
  };

  const startCropping = (index) => {
    setCroppingImageIndex(index);
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = useCallback(async () => {
    try {
      // Implement cropping logic here
      setCroppingImageIndex(null);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">
            <ShoppingBag className="w-10 h-10 mx-auto mb-2" />
            Edit Product
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  {...register("name", {
                    required: "Product name is required",
                  })}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  {...register("brand", { required: "Brand is required" })}
                />
                {errors.brand && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.brand.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  {...register("category", {
                    required: "Category is required",
                  })}
                />
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  {...register("price", { required: "Price is required" })}
                />
                {errors.price && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description", {
                  required: "Description is required",
                })}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <Label>Variants</Label>
              {variantFields.map((field, index) => (
                <Card key={field.id} className="mb-4">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`variants.${index}.color`}>Color</Label>
                        <Input
                          {...register(`variants.${index}.color`, {
                            required: "Color is required",
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`variants.${index}.ram`}>RAM</Label>
                        <Input
                          {...register(`variants.${index}.ram`, {
                            required: "RAM is required",
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`variants.${index}.storage`}>
                          Storage
                        </Label>
                        <Input
                          {...register(`variants.${index}.storage`, {
                            required: "Storage is required",
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`variants.${index}.price`}>Price</Label>
                        <Input
                          type="number"
                          {...register(`variants.${index}.price`, {
                            required: "Price is required",
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`variants.${index}.stock`}>Stock</Label>
                        <Input
                          type="number"
                          {...register(`variants.${index}.stock`, {
                            required: "Stock is required",
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`variants.${index}.sku`}>SKU</Label>
                        <Input
                          {...register(`variants.${index}.sku`, {
                            required: "SKU is required",
                          })}
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label>Images</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {field.images.map((image, imgIndex) => (
                          <div key={imgIndex} className="relative">
                            <img
                              src={image}
                              alt={`Variant ${index + 1} Image ${imgIndex + 1}`}
                              className="w-20 h-20 object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = [...field.images];
                                newImages.splice(imgIndex, 1);
                                // Update form data to remove this image
                              }}
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <Input
                        type="file"
                        onChange={(e) => handleImageUpload(e, index)}
                        multiple
                        accept="image/*"
                        className="mt-2"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="mt-2"
                      variant="destructive"
                    >
                      Remove Variant
                    </Button>
                  </CardContent>
                </Card>
              ))}
              <Button
                type="button"
                onClick={() =>
                  appendVariant({
                    color: "",
                    ram: "",
                    storage: "",
                    price: 0,
                    stock: 0,
                    images: [""],
                    sku: "",
                  })
                }
              >
                Add Variant
              </Button>
            </div>

            <div>
              <Label>Specifications</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="specifications.processor">Processor</Label>
                  <Input
                    {...register("specifications.processor", {
                      required: "Processor is required",
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="specifications.battery">Battery</Label>
                  <Input
                    {...register("specifications.battery", {
                      required: "Battery is required",
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="specifications.camera.front">
                    Front Camera
                  </Label>
                  <Input
                    {...register("specifications.camera.front", {
                      required: "Front camera is required",
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="specifications.camera.rear">
                    Rear Camera
                  </Label>
                  <Input
                    {...register("specifications.camera.rear", {
                      required: "Rear camera is required",
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="specifications.display.size">
                    Display Size
                  </Label>
                  <Input
                    {...register("specifications.display.size", {
                      required: "Display size is required",
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="specifications.display.resolution">
                    Display Resolution
                  </Label>
                  <Input
                    {...register("specifications.display.resolution", {
                      required: "Display resolution is required",
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="specifications.display.type">
                    Display Type
                  </Label>
                  <Input
                    {...register("specifications.display.type", {
                      required: "Display type is required",
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="specifications.os">Operating System</Label>
                  <Input
                    {...register("specifications.os", {
                      required: "Operating system is required",
                    })}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input {...register("tags")} />
            </div>

            <div>
              <Label htmlFor="releaseDate">Release Date</Label>
              <Input type="date" {...register("releaseDate")} />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isFeatured"
                {...register("isFeatured")}
                className="mr-2"
              />
              <Label htmlFor="isFeatured">Featured Product</Label>
            </div>

            <Button type="submit" className="w-full">
              Update Product
            </Button>
          </form>
        </CardContent>
      </Card>

      {croppingImageIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardContent className="p-4">
              <div className="relative h-64 mb-4">
                <Cropper
                  image={variantFields[croppingImageIndex].images[0]}
                  crop={crop}
                  zoom={zoom}
                  aspect={4 / 3}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              <div className="flex justify-between">
                <Button onClick={() => setCroppingImageIndex(null)}>
                  Cancel
                </Button>
                <Button onClick={handleCropSave}>Save Crop</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
