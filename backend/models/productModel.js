import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const product_schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
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
    required: true,
  },
  tags: [
    {
      type: String,
      required: true,
    },
  ],
  stock: {
    type: String,
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
      terms: [
        {
          term: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Terms",
            required: true,
          },
          sku: {
            type: String,
            required: true,
          },
        },
      ],
    },
  ],
});

product_schema.plugin(paginate);

const Product = mongoose.model("product", product_schema);

export default Product;

// Stock Keeping Unit (sku)

// In the context of your e-commerce website, an SKU might look like this: IPHONE13-SPACEGRAY-4GB-128GB.
// This SKU represents a specific variation of the iPhone 13 product:

// => IPHONE13 is the product name
// => SPACEGRAY is the color variation
// => 4GB is the RAM variation
// => 128GB is the storage variation
