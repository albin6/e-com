import mongoose from "mongoose";

const admin_schema = new mongoose.Schema({
  admin_id: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Admin = mongoose.model("admin", admin_schema);

export default Admin;
