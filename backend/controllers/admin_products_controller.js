import AsyncHandler from "express-async-handler";
import Category from "../models/categoryModel.js";
import Brand from "../models/brandModel.js";
import Product from "../models/productModel.js";
import path from "path";
import fs from "fs";

// GET /api/admin/products
export const get_all_product_details = AsyncHandler(async (req, res) => {
  console.log("hello in get_all_product_details");
  const products = await Product.find().exec();
  const brand = await Brand.find({ status: true });
  const category = await Category.find({ status: true });

  console.log(products);
  console.log(brand);
  console.log(category);

  res.json({ success: true, products, brand, category });
});

// POST /api/admin/products
export const add_new_product = AsyncHandler(async (req, res) => {
  const {
    name,
    brand,
    description,
    category,
    price,
    discount,
    specifications,
    tags,
    releaseDate,
    isFeatured,
    variants,
  } = req.body;

  // Handling file uploads for product images
  const images = req.files.map((file) => file.filename); // Assuming the images are sent as 'files' in the request

  const brand_data = await Brand.findOne({ name: brand });
  const category_data = await Category.findOne({ title: category });

  console.log("category and brand ===>>>", brand_data, category_data);

  try {
    // Create a new product instance
    const newProduct = new Product({
      name,
      brand: brand_data._id,
      description,
      category: category_data._id,
      price,
      discount,
      specifications,
      tags: tags.split(",").map((tag) => tag.trim()), // Assuming tags are passed as a comma-separated string
      releaseDate,
      isFeatured,
      variants: variants.map((variant) => ({
        ...variant,
        images, // Attach images to each variant (you can adjust this if needed)
      })),
    });

    console.log("hereeeeeeeeeeeeeeee", newProduct);

    // Save the new product to the database
    const savedProduct = await newProduct.save();

    console.log(savedProduct);

    // Send a success response
    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: savedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add product",
      error: error.message,
    });
  }
});
