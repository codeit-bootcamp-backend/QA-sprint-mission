import { Router } from "express";
import { asyncHandler } from "../asyncHandler.js";
import { getUserList, productLike } from "./user.service.js";

const userRoutes = Router();

userRoutes.route("/").get(asyncHandler(getUserList));

userRoutes.route("/");

userRoutes.route("/:id/productLike").patch(asyncHandler(productLike));

export default userRoutes;
