import * as dotenv from "dotenv";
import express from "express";
import productRoutes from "./module/products/products.controller.js";
import boardRoutes from "./module/board/board.controller.js";
import commentRoutes from "./module/comment/comment.controller.js";
import cors from "cors";
import imageUploadRoutes from "./module/imageUpload/imageUpload.controller.js";
import authRoutes from "./module/auth/auth.controller.js";
import cookieParser from "cookie-parser";
import { authValidate } from "./helper/jwt.js";

dotenv.config();

const corsOptions = {
  origin: ["http://127.0.0.1:8080"],
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// 엑세스 토큰 관련
app.use(authValidate);

app.use("/products", productRoutes);
app.use("/auth", authRoutes);
app.use("/boards", boardRoutes);
app.use("/comments", commentRoutes);
app.use("/upload", imageUploadRoutes);

app.listen(process.env.PORT || 3000, () => console.log("Server Started"));
