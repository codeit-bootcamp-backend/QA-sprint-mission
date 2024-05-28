import express from "express";
import fs from "fs";
import moment from "moment-timezone";
import morgan from "morgan";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import errorHandler from "./middlewares/errorHandler.js";
import articlesRouter from "./routes/articles.js";
import authRouter from "./routes/auth.js";
import imagesRouter from "./routes/images.js";
import productsRouter from "./routes/products.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

morgan.token("date", (req, res, tz) => {
  return moment().tz(tz).format("YYYY-MM-DD HH:mm:ss");
});

const customFormat = ":method :url :status :res[content-length] - :response-time ms - :date[Asia/Seoul]";

const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: "a" });

app.use(morgan(customFormat, { stream: accessLogStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/products", productsRouter);
app.use("/articles", articlesRouter);
app.use("/images", imagesRouter);
app.use("/auth", authRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
