import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    favoriteCount: {
      type: Number,
      default: 0,
    },
    ownerId: {
      type: Number,
      required: true,
    },

    images: {
      type: [String],
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    isFavorite: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
