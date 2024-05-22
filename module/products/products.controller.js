import { Router } from "express";
import { createProduct, deleteProduct, getProduct, getProductList, updateProduct } from "./products.service.js";
import { asyncHandler } from "../asyncHandler.js";

const productRoutes = Router();

productRoutes.route("/").get(asyncHandler(getProductList)).post(asyncHandler(createProduct));

productRoutes
  .route("/:id")
  .get(asyncHandler(getProduct))
  .patch(asyncHandler(updateProduct))
  .delete(asyncHandler(deleteProduct));

export default productRoutes;
