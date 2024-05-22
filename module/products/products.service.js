import { Product_findUnique } from "./repository/Product_findUnique.js";
import { Product_delete } from "./repository/Product_delete.js";
import { Product_update } from "./repository/Product_update.js";
import { Product_create } from "./repository/Product_create.js";
import { Product_findMany } from "./repository/Product_findMany.js";

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
