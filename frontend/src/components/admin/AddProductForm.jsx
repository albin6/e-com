import React, { useState, useCallback } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { PlusCircle, X, Upload, Crop, ShoppingBag } from "lucide-react";
import Cropper from "react-easy-crop";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Textarea,
  Label,
  Input,
  Button,
} from "../ui/ui-components";

const AddProductSchema = Yup.object().shape({
  name: Yup.string().required("Product name is required"),
  description: Yup.string().required("Description is required"),
  price: Yup.number()
    .positive("Price must be positive")
    .required("Price is required"),
  discount: Yup.number()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%"),
  category: Yup.string().required("Category is required"),
  brand: Yup.string().required("Brand is required"),
  stock: Yup.number()
    .integer("Stock must be an integer")
    .min(0, "Stock cannot be negative")
    .required("Stock is required"),
  variations: Yup.array().of(
    Yup.object().shape({
      attribute: Yup.string().required("Attribute is required"),
      terms: Yup.array().of(
        Yup.object().shape({
          term: Yup.string().required("Term is required"),
          sku: Yup.string().required("SKU is required"),
        })
      ),
    })
  ),
});

const InputField = ({ label, name, ...props }) => (
  <div className="mb-4">
    <Label htmlFor={name} className="text-sm font-medium text-gray-700">
      {label}
    </Label>
    <Field name={name}>
      {({ field, meta }) => (
        <div>
          <Input
            {...field}
            {...props}
            className={`mt-1 block w-full rounded-md ${
              meta.touched && meta.error ? "border-red-500" : "border-gray-300"
            }`}
          />
          <ErrorMessage
            name={name}
            component="div"
            className="text-red-500 text-xs mt-1"
          />
        </div>
      )}
    </Field>
  </div>
);

export default function Component() {
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [croppingImageIndex, setCroppingImageIndex] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

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

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === "variations") {
          formData.append(key, JSON.stringify(values[key]));
        } else {
          formData.append(key, values[key]);
        }
      });
      images.forEach((image, index) => {
        formData.append(`images`, image.file);
      });

      // Here you would typically send the formData to your API
      console.log("Form data:", formData);
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Product added successfully");
      // Handle success (e.g., show a success message, redirect)
    } catch (error) {
      console.error("Error adding product:", error);
      setError("An error occurred while adding the product");
    }
    setSubmitting(false);
  };

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
          <Formik
            initialValues={{
              name: "",
              description: "",
              price: "",
              discount: "",
              category: "",
              brand: "",
              stock: "",
              variations: [{ attribute: "", terms: [{ term: "", sku: "" }] }],
            }}
            validationSchema={AddProductSchema}
            onSubmit={handleSubmit}
          >
            {({ values, isSubmitting }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <InputField
                    label="Product Name"
                    name="name"
                    placeholder="Enter product name"
                  />
                  <div className="mb-4">
                    <Label
                      htmlFor="brand"
                      className="text-sm font-medium text-gray-700"
                    >
                      Brand
                    </Label>
                    <Field name="brand">
                      {({ field }) => (
                        <Select onValueChange={field.onChange} {...field}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a brand" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="apple">Apple</SelectItem>
                            <SelectItem value="samsung">Samsung</SelectItem>
                            <SelectItem value="google">Google</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </Field>
                    <ErrorMessage
                      name="brand"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  <div className="mb-4">
                    <Label
                      htmlFor="category"
                      className="text-sm font-medium text-gray-700"
                    >
                      Category
                    </Label>
                    <Field name="category">
                      {({ field }) => (
                        <Select onValueChange={field.onChange} {...field}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="smartphones">
                              Smartphones
                            </SelectItem>
                            <SelectItem value="tablets">Tablets</SelectItem>
                            <SelectItem value="accessories">
                              Accessories
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </Field>
                    <ErrorMessage
                      name="category"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  <InputField
                    label="Stock"
                    name="stock"
                    type="number"
                    placeholder="Enter stock quantity"
                  />
                  <InputField
                    label="Price"
                    name="price"
                    type="number"
                    placeholder="Enter price"
                  />
                  <InputField
                    label="Discount (%)"
                    name="discount"
                    type="number"
                    placeholder="Enter discount percentage"
                  />
                </div>

                <div className="mb-4">
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium text-gray-700"
                  >
                    Description
                  </Label>
                  <Field
                    name="description"
                    as={Textarea}
                    rows={3}
                    placeholder="Enter product description"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-xs mt-1"
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
                            variant="outline"
                            onClick={() => setCroppingImageIndex(null)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleCropSave}>Save Crop</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <FieldArray name="variations">
                  {({ push, remove }) => (
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2">
                        Variations
                      </Label>
                      {values.variations.map((_, index) => (
                        <Card key={index} className="mb-4">
                          <CardContent className="p-4">
                            <InputField
                              label="Attribute"
                              name={`variations.${index}.attribute`}
                              placeholder="e.g., Color, Size"
                            />
                            <FieldArray name={`variations.${index}.terms`}>
                              {({ push: pushTerm, remove: removeTerm }) => (
                                <div>
                                  {values.variations[index].terms.map(
                                    (_, termIndex) => (
                                      <div
                                        key={termIndex}
                                        className="flex items-center space-x-2 mt-2"
                                      >
                                        <Input
                                          name={`variations.${index}.terms.${termIndex}.term`}
                                          placeholder="Term"
                                          className="flex-1"
                                        />
                                        <Input
                                          name={`variations.${index}.terms.${termIndex}.sku`}
                                          placeholder="SKU"
                                          className="flex-1"
                                        />
                                        <Button
                                          type="button"
                                          onClick={() => removeTerm(termIndex)}
                                          variant="destructive"
                                          size="icon"
                                        >
                                          <X className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    )
                                  )}
                                  <Button
                                    type="button"
                                    onClick={() =>
                                      pushTerm({ term: "", sku: "" })
                                    }
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                  >
                                    <PlusCircle className="w-4 h-4 mr-2" /> Add
                                    Term
                                  </Button>
                                </div>
                              )}
                            </FieldArray>
                            {index > 0 && (
                              <Button
                                type="button"
                                onClick={() => remove(index)}
                                variant="destructive"
                                size="sm"
                                className="mt-2"
                              >
                                Remove Variation
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                      <Button
                        type="button"
                        onClick={() =>
                          push({
                            attribute: "",
                            terms: [{ term: "", sku: "" }],
                          })
                        }
                        variant="outline"
                      >
                        <PlusCircle className="w-5 h-5 mr-2" /> Add Variation
                      </Button>
                    </div>
                  )}
                </FieldArray>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? "Adding Product..." : "Add Product"}
                </Button>
              </Form>
            )}
          </Formik>
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
