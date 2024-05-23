import { Router } from "express";
import { asyncHandler } from "../asyncHandler.js";
import { createUser, deleteUser, getUser, getUserList } from "./user.service.js";

const userRoutes = Router();

userRoutes.route("/").get(asyncHandler(getUserList)).post(asyncHandler(createUser));
userRoutes.route("/:id").get(asyncHandler(getUser)).delete(asyncHandler(deleteUser));

export default userRoutes;
