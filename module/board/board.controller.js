import { Router } from "express";

import { asyncHandler } from "../asyncHandler.js";
import { createBoard, deleteBoard, getBoard, getBoardList } from "./board.service.js";

const boardRoutes = Router();

boardRoutes.route("/").get(asyncHandler(getBoardList)).post(asyncHandler(createBoard));
boardRoutes.route("/:id").get(asyncHandler(getBoard)).delete(asyncHandler(deleteBoard));

export default boardRoutes;
