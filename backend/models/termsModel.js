import mongoose from "mongoose";

const terms_schema = new mongoose.Schema({
  attribute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Attribute",
    required: true,
  },
  value: {
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

const Terms = mongoose.model("term", terms_schema);

export default Terms;
