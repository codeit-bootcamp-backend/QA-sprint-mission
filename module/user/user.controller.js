import { Router } from "express";
import { asyncHandler } from "../asyncHandler.js";
import {
  getUser,
  getUserFavoriteProduct,
  getUserOwnedProduct,
  updateUser,
  updateUserPassword,
} from "./user.service.js";

const userRouters = Router();

userRouters.route("/me").get(asyncHandler(getUser)).patch(asyncHandler(updateUser));
userRouters.route("/me/password").patch(asyncHandler(updateUserPassword));
userRouters.route("/me/products").get(asyncHandler(getUserOwnedProduct));
userRouters.route("/me/favorites").get(asyncHandler(getUserFavoriteProduct));

export default userRouters;
