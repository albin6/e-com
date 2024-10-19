import AsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import {
  compare_password,
  hash_password,
} from "../utils/secure-password/password-bcrypt.js";

// for getting user information
export const get_user_info = AsyncHandler(async (req, res) => {
  console.log("in get_user_info");
  const user_id = req.user.id;

  const user_data = await User.findById(user_id);

  console.log("user_data => ", user_data);
  res.status(200).json({ success: true, user_data });
});

// for updating user information
export const update_user_info = AsyncHandler(async (req, res) => {
  console.log("in update_user_info");
  const user_id = req.user.id;
  const user_data = req.body;

  console.log(user_id, user_data);

  const user = await User.findById(user_id);

  user.first_name = user_data.first_name || user.first_name;
  user.last_name = user_data.last_name || user.last_name;
  user.phone_number = user_data.phone_number || user.phone_number;
  user.email = user_data.email || user.email;
  user.password = (await compare_password(
    user_data.currentPassword,
    user.password
  ))
    ? user.password
    : await hash_password(user_data.confirmPassword);

  await user.save();

  res.json({ success: true, user });
});
