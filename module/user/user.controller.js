import { Router } from "express";
import { asyncHandler } from "../asyncHandler.js";

const authRoutes = Router();

authRoutes.route("/me").get(asyncHandler()).patch(asyncHandler());
authRoutes.route("/me/password").patch(asyncHandler());
authRoutes.route("/me/products").get(asyncHandler());
authRoutes.route("/me/favorites").get(asyncHandler());

export default authRoutes;
