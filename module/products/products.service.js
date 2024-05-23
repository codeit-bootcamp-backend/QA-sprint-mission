import { Product_findUnique } from "./repository/Product_findUnique.js";
import { Product_delete } from "./repository/Product_delete.js";
import { Product_update } from "./repository/Product_update.js";
import { Product_create } from "./repository/Product_create.js";
import { Product_findMany } from "./repository/Product_findMany.js";
import { Product_likes } from "./repository/Product_likes.js";
import { Product_dislikes } from "./repository/Product_dislikes.js";
import { Comment_create_onProduct } from "../comment/repository/Comment_create.js";
import { Comment_findMany_onProduct } from "../comment/repository/Comment_findMany.js";

export function getProductList(req, res) {
  Product_findMany(req, res);
}

export function getProduct(req, res) {
  Product_findUnique(req, res);
}

export function createProduct(req, res) {
  Product_create(req, res);
}

export function updateProduct(req, res) {
  Product_update(req, res);
}

export function deleteProduct(req, res) {
  Product_delete(req, res);
}

export function likeProduct(req, res) {
  Product_likes(req, res);
}

export function dislikeProduct(req, res) {
  Product_dislikes(req, res);
}

export function createComment(req, res) {
  Comment_create_onProduct(req, res);
}

export function getCommentList(req, res) {
  Comment_findMany_onProduct(req, res);
}
