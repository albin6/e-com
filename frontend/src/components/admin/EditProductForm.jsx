import React, { useState, useEffect } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { PlusCircle, MinusCircle, Upload, X } from "lucide-react";

const EditProductForm = ({ product }) => {
  const [images, setImages] = useState(product?.images || []);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number()
      .positive("Price must be positive")
      .required("Price is required"),
    discount: Yup.number()
      .min(0, "Discount cannot be negative")
      .max(100, "Discount cannot exceed 100%"),
    brand: Yup.string().required("Brand is required"),
    category: Yup.string().required("Category is required"),
    stock: Yup.number()
      .integer("Stock must be an integer")
      .min(0, "Stock cannot be negative")
      .required("Stock is required"),
    tags: Yup.array().of(Yup.string()),
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

  const handleImageUpload = (event, setFieldValue) => {
    const files = Array.from(event.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages((prevImages) => [...prevImages, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
    setFieldValue("images", [...images, ...files]);
  };

  const removeImage = (index, setFieldValue) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setFieldValue(
      "images",
      images.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Edit Product: {product?.name}
      </h2>
      <Formik
        initialValues={{
          name: product?.name || "",
          description: product?.description || "",
          price: product?.price || "",
          discount: product?.discount || "",
          brand: product?.brand || "",
          category: product?.category || "",
          images: product?.images || [],
          stock: product?.stock || "",
          tags: product?.tags || [""],
          variations: product?.variations || [
            { attribute: "", terms: [{ term: "", sku: "" }] },
          ],
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values);
          // Here you would typically make an API call to update the product
          setSubmitting(false);
        }}
      >
        {({ values, errors, touched, setFieldValue, isSubmitting }) => (
          <Form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <Field
                  name="name"
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price
                </label>
                <Field
                  name="price"
                  type="number"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <ErrorMessage
                  name="price"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="discount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Discount (%)
                </label>
                <Field
                  name="discount"
                  type="number"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <ErrorMessage
                  name="discount"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Stock
                </label>
                <Field
                  name="stock"
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <ErrorMessage
                  name="stock"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="brand"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Brand
                </label>
                <Field
                  name="brand"
                  as="select"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option value="">Select a brand</option>
                  <option value="apple">Apple</option>
                  <option value="samsung">Samsung</option>
                  <option value="google">Google</option>
                </Field>
                <ErrorMessage
                  name="brand"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <Field
                  name="category"
                  as="select"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option value="">Select a category</option>
                  <option value="smartphone">Smartphone</option>
                  <option value="tablet">Tablet</option>
                  <option value="accessory">Accessory</option>
                </Field>
                <ErrorMessage
                  name="category"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <Field
                name="description"
                as="textarea"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="images"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Images
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="images"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload files</span>
                      <input
                        id="images"
                        name="images"
                        type="file"
                        className="sr-only"
                        multiple
                        onChange={(event) =>
                          handleImageUpload(event, setFieldValue)
                        }
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
              <ErrorMessage
                name="images"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
              <div className="mt-4 grid grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index, setFieldValue)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <FieldArray name="tags">
              {({ insert, remove, push }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  {values.tags.length > 0 &&
                    values.tags.map((tag, index) => (
                      <div className="flex items-center mt-2" key={index}>
                        <Field
                          name={`tags.${index}`}
                          type="text"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        <button
                          type="button"
                          className="ml-2 text-red-600 hover:text-red-800"
                          onClick={() => remove(index)}
                        >
                          <MinusCircle className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  <button
                    type="button"
                    className="mt-2 text-indigo-600 hover:text-indigo-800"
                    onClick={() => push("")}
                  >
                    <PlusCircle className="h-5 w-5 inline mr-1" /> Add Tag
                  </button>
                </div>
              )}
            </FieldArray>

            <FieldArray name="variations">
              {({ insert, remove, push }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Variations
                  </label>
                  {values.variations.length > 0 &&
                    values.variations.map((variation, index) => (
                      <div
                        key={index}
                        className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <Field
                            name={`variations.${index}.attribute`}
                            as="select"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          >
                            <option value="">Select an attribute</option>
                            <option value="color">Color</option>
                            <option value="size">Size</option>
                            <option value="storage">Storage</option>
                          </Field>
                          <button
                            type="button"
                            className="text-red-600 hover:text-red-800"
                            onClick={() => remove(index)}
                          >
                            <MinusCircle className="h-5 w-5" />
                          </button>
                        </div>
                        <FieldArray name={`variations.${index}.terms`}>
                          {({ insert, remove, push }) => (
                            <div>
                              {variation.terms.length > 0 &&
                                variation.terms.map((term, termIndex) => (
                                  <div key={termIndex} className="flex mt-2">
                                    <Field
                                      name={`variations.${index}.terms.${termIndex}.term`}
                                      type="text"
                                      placeholder="Term"
                                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    <Field
                                      name={`variations.${index}.terms.${termIndex}.sku`}
                                      type="text"
                                      placeholder="SKU"
                                      className="ml-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    <button
                                      type="button"
                                      className="ml-2 text-red-600 hover:text-red-800"
                                      onClick={() => remove(termIndex)}
                                    >
                                      <MinusCircle className="h-5 w-5" />
                                    </button>
                                  </div>
                                ))}
                              <button
                                type="button"
                                className="mt-2 text-indigo-600 hover:text-indigo-800"
                                onClick={() => push({ term: "", sku: "" })}
                              >
                                <PlusCircle className="h-5 w-5 inline mr-1" />{" "}
                                Add Term
                              </button>
                            </div>
                          )}
                        </FieldArray>
                      </div>
                    ))}
                  <button
                    type="button"
                    className="mt-2 text-indigo-600 hover:text-indigo-800"
                    onClick={() =>
                      push({ attribute: "", terms: [{ term: "", sku: "" }] })
                    }
                  >
                    <PlusCircle className="h-5 w-5 inline mr-1" /> Add Variation
                  </button>
                </div>
              )}
            </FieldArray>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                {isSubmitting ? "Updating Product..." : "Update Product"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditProductForm;
