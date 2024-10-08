import AsyncHandler from "express-async-handler";
import Category from "../models/categoryModel.js";
import Brand from "../models/brandModel.js";
import Product from "../models/productModel.js";

// GET /api/admin/products
export const get_products_details = AsyncHandler(async (req, res) => {
  console.log("hello in get_all_product_details");

  try {
    // Fetch all products with populated category and brand details
    const products = await Product.find({ is_active: true })
      .populate("category")
      .populate("brand");

    // Fetch all categories
    const categories = await Category.find({ status: true });
    if (!categories) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch categories" });
    }

    // Fetch all brands
    const brands = await Brand.find({ status: true });
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
      });
    }

    console.log(products);
    console.log(categories);
    console.log(brands);

    // If everything is successful, return the data
    res.status(200).json({ success: true, products, brands, categories });
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

// GET /api/users/products
export const get_all_products_details = AsyncHandler(async (req, res) => {
  console.log("hello in get_all_product_details");

  try {
    // Fetch all products with populated category and brand details
    const products = await Product.find({ is_active: true })
      .populate("category")
      .populate("brand");

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
      });
    }

    console.log(products);
    console.log(categories);
    console.log(brands);

    // If everything is successful, return the data
    res.status(200).json({ success: true, products, brands, categories });
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

// GET /api/users/get_product
export const get_product = AsyncHandler(async (req, res) => {
  const productId = req.params.productId;

  const product = await Product.findOne({ _id: productId })
    .populate("category")
    .populate("brand");

  console.log("in get product =>>>>", product);

  res.json({ product });
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

  // Create an object to map images to their respective variants
  const imagesByVariant = {};

  // Handle file uploads
  if (req.files && req.files.length > 0) {
    req.files.forEach((file) => {
      const variantId = file.fieldname.split("[")[1].split("]")[0];
      console.log("variant id =====>>>", variantId);
      if (!imagesByVariant[variantId]) {
        imagesByVariant[variantId] = [];
      }
      imagesByVariant[variantId].push(file.filename);
    });
  }

  console.log("image by variant ====>>>>>>>>>", imagesByVariant);
  try {
    // Fetch brand and category information from the database
    const brand_data = await Brand.findOne({ name: brand });
    if (!brand_data) {
      return res
        .status(400)
        .json({ success: false, message: "Brand not found" });
    }

    const category_data = await Category.findOne({ title: category });
    if (!category_data) {
      return res
        .status(400)
        .json({ success: false, message: "Category not found" });
    }

    // Create a new product instance, mapping images to their respective variants
    const newProduct = new Product({
      name,
      brand: brand_data._id,
      description,
      category: category_data._id,
      price: Number(price),
      discount: Number(discount),
      specifications,
      tags: tags.split(",").map((tag) => tag.trim()),
      releaseDate,
      isFeatured,
      variants: variants.map((variant, index) => ({
        color: variant.color,
        ram: variant.ram,
        storage: variant.storage,
        price: Number(variant.price),
        stock: Number(variant.stock),
        sku: variant.sku,
        images: imagesByVariant[index] || [], // Attach images to their respective variant
      })),
    });

    // Save the new product to the database
    const savedProduct = await newProduct.save();

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
