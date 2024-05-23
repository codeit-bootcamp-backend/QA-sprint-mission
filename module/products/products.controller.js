import { Router } from "express";
import {
  createComment,
  createProduct,
  deleteProduct,
  dislikeProduct,
  getProduct,
  getProductList,
  likeProduct,
  updateProduct,
} from "./products.service.js";
import { asyncHandler } from "../asyncHandler.js";

const productRoutes = Router();

productRoutes.route("/").get(asyncHandler(getProductList)).post(asyncHandler(createProduct));

productRoutes
  .route("/:id")
  .get(asyncHandler(getProduct))
  .patch(asyncHandler(updateProduct))
  .delete(asyncHandler(deleteProduct));

productRoutes.route("/:id/comment").post(asyncHandler(createComment));
productRoutes.route("/:id/like").patch(asyncHandler(likeProduct));
productRoutes.route("/:id/dislike").patch(asyncHandler(dislikeProduct));

export default productRoutes;
