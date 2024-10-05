import mongoose, { ModifiedPathsSnapshot } from "mongoose";

const attribute_schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    required: true,
  },
});

const Attribute = mongoose.model("attribute", attribute_schema);

export default Attribute;
