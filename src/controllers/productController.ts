import { assert } from "superstruct";
import * as productService from "../services/productService.js";
import { CreateProduct, PatchProduct } from "../structs.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getProducts = asyncHandler(async (req, res) => {
  const { offset = 0, limit = 10, orderBy = "recent", keyword = "" } = req.query;
  const products = await productService.getProducts({ offset, limit, orderBy, keyword });
  res.send(products);
});

export const createProduct = asyncHandler(async (req, res) => {
  assert(req.body, CreateProduct);
  const { userId } = req;
  const product = await productService.createProduct({ ...req.body, userId });
  res.status(201).send(product);
});

export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await productService.getProductById(id);
  res.send(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  assert(req.body, PatchProduct);

  const { id: productId } = req.params;
  const { userId } = req;

  try {
    const updatedProduct = await productService.updateProduct(productId, userId, req.body);
    res.send(updatedProduct);
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;
  const { userId } = req;

  try {
    await productService.deleteProduct(productId, userId);
    res.sendStatus(204);
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
});

export const likeProduct = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;
  const { userId } = req;

  try {
    const updatedProduct = await productService.likeProduct(productId, userId);
    res.send(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export const unlikeProduct = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;
  const { userId } = req;

  try {
    const updatedProduct = await productService.unlikeProduct(productId, userId);
    res.send(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
