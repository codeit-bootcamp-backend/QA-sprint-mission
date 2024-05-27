import express from "express";
import articlesRouter from "./routes/articles.js";
import imagesRouter from "./routes/images.js";
import productsRouter from "./routes/products.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/products", productsRouter);
app.use("/articles", articlesRouter);
app.use("/images", imagesRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
