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

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const sort = req.query.sort || "newest";
  const skip = (page - 1) * limit;

  // Extract filter parameters
  const { brand, os, ram, storage } = req.query;
  console.log(brand, os, ram, storage);

  // Build the filter object
  const filter = {
    category: categoryId,
    is_active: true,
  };

  if (brand) {
    const brandIds = await Brand.find({
      name: { $in: brand },
    }).distinct("_id");
    filter.brand = { $in: brandIds };
  }

  if (os) {
    filter["specifications.os"] = { $in: os };
  }

  if (ram) {
    filter["variants"] = { $elemMatch: { ram: { $in: ram.split(",") } } };
  }

  if (storage) {
    if (filter["variants"]) {
      filter["variants"].$elemMatch.storage = { $in: storage.split(",") };
    } else {
      filter["variants"] = {
        $elemMatch: { storage: { $in: storage.split(",") } },
      };
    }
  }

  const totalProducts = await Product.countDocuments(filter);
  const totalPages = Math.ceil(totalProducts / limit);

  let sortOption = {};
  if (sort === "newest") {
    sortOption = { createdAt: -1 };
  } else if (sort === "priceLowHigh") {
    sortOption = { price: 1 };
  } else if (sort === "priceHighLow") {
    sortOption = { price: -1 };
  } else if (sort === "discountHighLow") {
    sortOption = { discount: -1 };
  }

  const products = await Product.find(filter)
    .populate("category")
    .populate("brand")
    .skip(skip)
    .limit(limit)
    .sort(sortOption);

  const categories = await Category.find();
  if (!categories || categories.length === 0) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch categories" });
  }

  const brands = await Brand.find();
  if (!brands || brands.length === 0) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch brands" });
  }

  if (!products || products.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No products found in this category",
    });
  }

  res.status(200).json({
    success: true,
    products,
    brands,
    categories,
    totalPages,
    currentPage: page,
  });
});

export const get_products_of_brand = AsyncHandler(async (req, res) => {
  const brandId = req.params.brandId;

  // Validate that the brandId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(brandId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid brand ID",
    });
  }

  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 6; // Default to 6 items per page
  const sort = req.query.sort || "newest"; // Default to newest if not provided
  const skip = (page - 1) * limit;

  // Extract specific filters from the query
  const { storage, ram } = req.query;

  console.log(storage, ram);

  // Build the filter object for the query
  const filter = {
    brand: brandId,
    is_active: true,
    ...(storage &&
      ram && {
        variants: { $elemMatch: { storage, ram } },
      }),
    ...(storage && !ram && { "variants.storage": storage }),
    ...(ram && !storage && { "variants.ram": ram }),
  };
  try {
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    const sortOptions = {
      newest: { createdAt: -1 },
      priceLowHigh: { price: 1 },
      priceHighLow: { price: -1 },
      discountHighLow: { discount: -1 },
    };
    const sortBy = sortOptions[sort] || sortOptions.newest;

    const products = await Product.find(filter)
      .populate("category")
      .populate("brand")
      .skip(skip)
      .limit(limit)
      .sort(sortBy);

    const [categories, brands] = await Promise.all([
      Category.find(),
      Brand.find(),
    ]);

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: "No products found for this brand",
      });
    }

    res.status(200).json({
      success: true,
      products,
      brands,
      categories,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching products",
      error: error.message,
    });
  }
});

export const get_listing_products_details = AsyncHandler(async (req, res) => {
  console.log("Received query params:", req.query);

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const sort = req.query.sort || "newest";
    const skip = (page - 1) * limit;

    let brand;
    if (req.query.brand) {
      brand = await Brand.findOne({ name: { $in: req.query.brand } });
      console.log("Found brand:", brand);
      const res = await Product.findOne({ brand: brand._id });
      console.log(res);
    }

    // Add filtering
    const filter = { is_active: true };
    if (brand) {
      filter["brand"] = brand._id; // Safe access
    }
    if (req.query.os) {
      filter["specifications.os"] = { $in: req.query.os.split(",") };
    }
    if (req.query.processorBrand) {
      filter["specifications.processor"] = {
        $regex: new RegExp(req.query.processorBrand.split(",").join("|"), "i"),
      };
    }
    if (req.query.ram) {
      filter["variants.ram"] = { $in: req.query.ram.split(",") };
    }

    console.log("Applied filter:", filter);

    // Prepare sort object
    const sortObj = {};
    switch (sort) {
      case "newest":
        sortObj.createdAt = -1;
        break;
      case "priceLowHigh":
        sortObj.price = 1;
        break;
      case "priceHighLow":
        sortObj.price = -1;
        break;
      case "discountHighLow":
        sortObj.discount = -1;
        break;
      default:
        break;
    }

    // Use aggregation for efficient querying
    const [products, totalProducts, categories, brands] = await Promise.all([
      Product.aggregate([
        { $match: filter },
        { $sort: sortObj },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $lookup: {
            from: "brands",
            localField: "brand",
            foreignField: "_id",
            as: "brand",
          },
        },
        { $unwind: "$category" },
        { $unwind: "$brand" },
      ]),
      Product.countDocuments(filter),
      Category.find().lean(),
      Brand.find().lean(),
    ]);

    const totalPages = Math.ceil(totalProducts / limit);

    console.log("Total products after filtering:", totalProducts);
    console.log("Products returned:", products.length);

    res.status(200).json({
      success: true,
      products,
      brands,
      categories,
      totalPages,
      currentPage: page,
      totalProducts,
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching product details",
      error: error.message,
    });
  }
});
