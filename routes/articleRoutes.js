import express from "express";
import * as articleController from "../controllers/articleController.js";
import * as commentController from "../controllers/commentController.js";
import authenticate from "../middlewares/authenticate.js";
const router = express.Router();
router.route("/").get(articleController.getArticles).post(authenticate, articleController.createArticle);

router
  .route("/:id")
  .get(articleController.getArticleById)
  .patch(authenticate, articleController.updateArticle)
  .delete(authenticate, articleController.deleteArticle);

router.route("/:id/like").patch(authenticate, articleController.likeArticle);

router.route("/:id/unlike").patch(authenticate, articleController.unlikeArticle);

router
  .route("/:articleId/comments")
  .get(commentController.getCommentsByProductId)
  .post(authenticate, commentController.createComment);

router
  .route("/:articleId/comments/:commentId")
  .patch(authenticate, commentController.updateComment)
  .delete(authenticate, commentController.deleteComment);

export default router;
