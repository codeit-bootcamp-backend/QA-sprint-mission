import * as dotenv from "dotenv";
import express from "express";
import productRoutes from "./module/products/products.controller.js";
import userRoutes from "./module/users/user.controller.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/boards", boardRoutes);

app.listen(process.env.PORT || 3000, () => console.log("Server Started"));
