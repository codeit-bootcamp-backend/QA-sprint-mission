import express from "express";
import * as commentController from "../controllers/commentController.js";
import * as productController from "../controllers/productController.js";
import authenticate from "../middlewares/authenticate.js";
const router = express.Router();

router.route("/").get(productController.getProducts).post(authenticate, productController.createProduct);

router
  .route("/:id")
  .get(productController.getProductById)
  .patch(authenticate, productController.updateProduct)
  .delete(authenticate, productController.deleteProduct);

router.route("/:id/like").patch(authenticate, productController.likeProduct);

router.route("/:id/unlike").patch(authenticate, productController.unlikeProduct);
router
  .route("/:productId/comments")
  .get(commentController.getCommentsByProductId)
  .post(authenticate, commentController.createComment);

router
  .route("/:productId/comments/:commentId")
  .patch(authenticate, commentController.updateComment)
  .delete(authenticate, commentController.deleteComment);

export default router;
