import mongoose from "mongoose";

const coupon_schema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true, // Ensure that coupon codes are always uppercase
  },
  discount_type: {
    type: String,
    required: true,
    enum: ["percentage", "fixed"], // 'percentage' for percentage discount and 'fixed' for a fixed amount
  },
  discount_value: {
    type: Number,
    required: true,
    min: [0, "Discount value cannot be negative"],
  },
  min_purchase_amount: {
    type: Number,
    default: 0,
    min: [0, "Minimum purchase amount cannot be negative"],
  },
  max_discount_amount: {
    type: Number,
    default: null,
    min: [0, "Maximum discount amount cannot be negative"],
  },
  start_date: {
    type: Date,
    default: Date.now,
  },
  expiration_date: {
    type: Date,
    required: true,
  },
  usage_limit: {
    type: Number,
    default: null, // Null means unlimited usage
    min: [1, "Usage limit must be at least 1 if specified"],
  },
  used_count: {
    type: Number,
    default: 0,
    min: [0, "Used count cannot be negative"],
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  eligible_categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categorie", // Reference to eligible categories (if applicable)
    },
  ],
  eligible_products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Reference to eligible products (if applicable)
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update `updatedAt` before saving
coupon_schema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Coupon = mongoose.model("coupon", coupon_schema);

export default Coupon;
