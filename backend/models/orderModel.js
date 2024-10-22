import mongoose from "mongoose";

const order_schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  order_items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      variant: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity cannot be less than 1"],
      },
      price: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        required: true,
        min: [0, "Discount cannot be negative"],
        max: [100, "Discount cannot exceed 100%"],
      },
      total_price: {
        type: Number,
        required: true,
      },
    },
  ],
  total_amount: {
    type: Number,
    required: true,
    min: [0, "Total amount cannot be negative"],
  },
  shipping_address: {
    address_type: String,
    address: String,
    district: String,
    state: String,
    zip: String,
    phone: Number,
  },
  payment_method: {
    type: String,
    required: true,
    enum: ["Credit Card/ Debit Card", "Bank", "UPI", "Cash on Delivery"],
  },
  payment_status: {
    type: String,
    required: true,
    enum: ["Pending", "Paid", "Failed", "Refunded"],
    default: "Pending",
  },
  order_status: {
    type: String,
    required: true,
    enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, "Discount cannot be negative"],
    max: [100, "Discount cannot exceed 100%"],
  },
  shipping_fee: {
    type: Number,
    required: true,
    min: [0, "Shipping fee cannot be negative"],
  },
  total_price_with_discount: {
    type: Number,
    required: true,
  },
  placed_at: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  delivery_date: {
    type: Date,
  },
});

order_schema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Order = mongoose.model("order", order_schema);

export default Order;
