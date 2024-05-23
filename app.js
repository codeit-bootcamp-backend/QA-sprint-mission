import * as dotenv from "dotenv";
import express from "express";
import productRoutes from "./module/products/products.controller.js";
import userRoutes from "./module/users/user.controller.js";
import boardRoutes from "./module/board/board.controller.js";
import commentRoutes from "./module/comment/comment.controller.js";
import cors from "cors";
import imageUploadRoutes from "./module/imageUpload/ImageUpload.controller.js";

dotenv.config();

const corsOptions = {
  origin: ["http://127.0.0.1:8080"],
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/boards", boardRoutes);
app.use("/comments", commentRoutes);
app.use("/upload", imageUploadRoutes);

app.listen(process.env.PORT || 3000, () => console.log("Server Started"));
