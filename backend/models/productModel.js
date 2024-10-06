// models/Product.js
import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
import Attribute from "./Attribute";

const product_schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  isListed: {
    type: Boolean,
    default: true,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  tags: [
    {
      type: String,
      required: true,
    },
  ],
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  },
  variations: [
    {
      attribute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attribute",
        required: true,
      },
      value: {
        type: String,
        required: true,
      },
      sku: {
        type: String,
        required: true,
      },
    },
  ],
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User ",
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

product_schema.pre("save", function (next) {
  if (this.price <= 0) {
    next(new Error("Price must be a positive number"));
  } else if (this.discount < 0 || this.discount > this.price) {
    next(
      new Error(
        "Discount must be a non-negative number less than or equal to the price"
      )
    );
  } else if (this.stock < 0) {
    next(new Error("Stock must be a non-negative number"));
  } else {
    next();
  }
});

product_schema.plugin(paginate);

// Add indexes for improved query performance
product_schema.index({ name: 1 });
product_schema.index({ category: 1 });
product_schema.index({ brand: 1 });
product_schema.index({ price: 1 });

const Product = mongoose.model("Product", product_schema);

export default Product;
