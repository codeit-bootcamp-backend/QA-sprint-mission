import express from "express";
import fs from "fs";
import moment from "moment-timezone";
import morgan from "morgan";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
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
// 커스텀 포맷 설정: 한국 시간대의 현재 시간을 포함
const customFormat = ":method :url :status :res[content-length] - :response-time ms - :date[Asia/Seoul]";

// 로그 파일 스트림 생성
const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: "a" });

// morgan 미들웨어 설정 (로그 파일에 기록)
app.use(morgan(customFormat, { stream: accessLogStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/products", productsRouter);
app.use("/articles", articlesRouter);
app.use("/images", imagesRouter);
app.use("/auth", authRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
