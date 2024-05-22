import { Router } from "express";
import { asyncHandler } from "../asyncHandler.js";
import { getUserList, toggleProductLike } from "./user.service.js";

const userRoutes = Router();

userRoutes.route("/").get(asyncHandler(getUserList));

userRoutes.route("/:id").patch(asyncHandler(toggleProductLike));

export default userRoutes;
