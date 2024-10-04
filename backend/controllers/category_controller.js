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
  const category_id = req.params;
  console.log("params category id => ", category_id);
  console.log("category put req body => ", req.body);
});
