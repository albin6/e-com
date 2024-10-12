import AsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import Brand from "../models/brandModel.js";

export const get_products_of_category = AsyncHandler(async (req, res) => {
  const categoryId = req.params.categoryId;

  // Validate that the categoryId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid category ID",
    });
  }

  // Fetch all products of the given category
  const products = await Product.find({ category: categoryId });

  if (!products || products.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No products found in this category",
    });
  }

  res.json({ success: true, products });
});

export const get_listing_products_details = AsyncHandler(async (req, res) => {
  console.log("hello in get_all_product_details");

  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 6; // Default to 6 items per page
    const skip = (page - 1) * limit;

    // Fetch products with pagination
    const products = await Product.find({ is_active: true })
      .populate("category")
      .populate("brand")
      .skip(skip)
      .limit(limit);

    // Fetch total count of products for pagination
    const totalProducts = await Product.countDocuments({ is_active: true });
    const totalPages = Math.ceil(totalProducts / limit);

    // Fetch all categories
    const categories = await Category.find();
    if (!categories) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch categories" });
    }

    // Fetch all brands
    const brands = await Brand.find();
    if (!brands) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch brands" });
    }

    // Check if products exist
    if (!products.length) {
      return res.status(200).json({
        success: true,
        message: "No products found",
        products,
        brands,
        categories,
        totalPages,
      });
    }

    // If everything is successful, return the data
    res.status(200).json({
      success: true,
      products,
      brands,
      categories,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    // Catch any other errors and return a 500 status code
    console.error("Error fetching product details:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching product details",
      error: error.message,
    });
  }
});
