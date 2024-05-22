import { Router } from "express";

import { asyncHandler } from "../asyncHandler.js";

const boardRoutes = Router();

boardRoutes.route("/").get().post(asyncHandler());
boardRoutes.route("/:id").get();

export default boardRoutes;
