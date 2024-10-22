import AsyncHandler from "express-async-handler";
import Coupon from "../models/couponModel.js";

// for adding new coupon
export const add_new_coupon = AsyncHandler(async (req, res) => {
  console.log("in add_new_coupon");

  const {
    code,
    discount_type,
    discount_value,
    min_purchase_amount,
    max_discount_amount,
    start_date,
    expiration_date,
    usage_limit,
  } = req.body;

  if (
    !code ||
    !discount_type ||
    !discount_value ||
    !min_purchase_amount ||
    !max_discount_amount ||
    !start_date ||
    !expiration_date ||
    !usage_limit
  ) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  // check if coupon code already exists
  const existing_coupon = await Coupon.findOne({ code });

  if (existing_coupon) {
    return res.status(400).json({ message: "Coupon code already exists" });
  }

  // create new coupon
  const new_coupon = await Coupon.create({
    code,
    type,
    value,
    description,
    isActive,
  });

  res.status(201).json({ success: true, data: new_coupon });
});

// for getting coupons
export const get_coupons = AsyncHandler(async (req, res) => {
  console.log("in get_coupons");

  const { page = 1, limit = 10 } = req.query;

  // Convert page and limit to integers
  const pageInt = parseInt(page, 10);
  const limitInt = parseInt(limit, 10);

  // Calculate total number of coupons
  const totalCoupons = await Coupon.countDocuments();

  // Calculate total number of pages
  const totalPages = Math.ceil(totalCoupons / limitInt);

  // Fetch the coupons with pagination
  const coupons = await Coupon.find({})
    .skip((pageInt - 1) * limitInt)
    .limit(limitInt)
    .exec();

  res.status(200).json({
    success: true,
    data: {
      coupons,
      totalCoupons,
      totalPages,
      currentPage: pageInt,
      itemsPerPage: limitInt,
    },
  });
});
