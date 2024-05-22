import { Router } from "express";

import { asyncHandler } from "../asyncHandler.js";
import { createBoard, deleteBoard, getBoard, getBoardList, updateBoard } from "./board.service.js";

const boardRoutes = Router();

boardRoutes.route("/").get(asyncHandler(getBoardList)).post(asyncHandler(createBoard));
boardRoutes
  .route("/:id")
  .get(asyncHandler(getBoard))
  .delete(asyncHandler(deleteBoard))
  .patch(asyncHandler(updateBoard));

export default boardRoutes;
