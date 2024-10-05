import AsyncHandler from "express-async-handler";
import Category from "../models/categoryModel.js";

// GET /api/admin/categories
export const get_all_categories = AsyncHandler(async (req, res) => {
  const categories_data = await Category.find(
    {},
    { createdAt: false, updatedAt: false }
  );

  console.log("in get all categories => ", categories_data);
  res.json({ success: true, categories_data });
});

// POST /api/admin/categories
export const add_new_category = AsyncHandler(async (req, res) => {
  console.log(req.body);
  const { title, status } = req.body;

  const new_category = await Category.create({
    title,
    status,
  });

  if (new_category) {
    res.json({ success: true, message: "New Category Added Successfully" });
  }
});

// PUT /api/admin/categories
export const update_category = AsyncHandler(async (req, res) => {
  console.log("category put req body => ", req.body);
  const category = req.body;
  const category_data = await Category.findById(category._id);

  let is_updated = false;
  if (category.title && category.title !== category_data.title) {
    category_data.title = category.title;
    is_updated = true;
  }

  if (category.status && category.status !== category_data.status) {
    category_data.status = category.status;
    is_updated = true;
  }

  if (is_updated) {
    category_data.updatedAt = Date.now();
  }
  await category_data.save();

  console.log("after saving changes => ", category_data);

  res.json({ success: true, category_data });
});

// PATCH /api/admin/categories
export const update_category_status = AsyncHandler(async (req, res) => {
  const { categoryId } = req.body;

  const category_data = await Category.findById(categoryId);

  category_data.status = !category_data.status;

  await category_data.save();

  res.json({ success: true, category_data });
});
