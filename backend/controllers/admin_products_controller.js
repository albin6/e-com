import AsyncHandler from "express-async-handler";
import Category from "../models/categoryModel.js";
import Brand from "../models/brandModel.js";
import Product from "../models/productModel.js";
import Attribute from "../models/attributeModel.js";
import Terms from "../models/termsModel.js";
import { file_path_extractor } from "../utils/multer/file_path_extractor.js";

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
  const { name, description, price, discount, category, brand, stock } =
    req.body;
  const files = req.files;

  const is_product_exists = await Product.findOne({ name });

  if (is_product_exists) {
    res.status(409).json({
      success: false,
      message: "Product with this name already exists",
    });
  }

  const categoryData = await Category.findOne({ title: category });
  const brandData = await Brand.findOne({ name: brand });

  const product_data = {
    name,
    description,
    price,
    discount,
  };
});
