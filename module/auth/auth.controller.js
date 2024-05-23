import { Router } from "express";
import { asyncHandler } from "../asyncHandler.js";
import { signIn, signUp } from "./auth.service.js";

const authRoutes = Router();

authRoutes.route("/signUp").post(asyncHandler(signUp));
authRoutes.route("/signIn").post(asyncHandler(signIn));
authRoutes.route("/refresh-token").post(asyncHandler());

export default authRoutes;
