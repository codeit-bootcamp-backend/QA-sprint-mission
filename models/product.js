import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    tags: {
      type: [String],
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    favoriteCount: {
      type: Number,
      default: 0,
    },
    isFavorite: {
      type: Boolean,
      required: true,
      default: false,
    },
    ownerId: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
