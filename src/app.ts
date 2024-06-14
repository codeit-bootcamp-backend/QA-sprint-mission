import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import fs from "fs";
import moment from "moment-timezone";
import morgan from "morgan";
import path, { dirname } from "path";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";
import passport from "./config/passport";
import errorHandler from "./middlewares/errorHandler";
import articlesRouter from "./routes/articleRoutes";
import authRouter from "./routes/authRoutes";
import imagesRouter from "./routes/imageRoutes";
import productsRouter from "./routes/productRoutes";
import swaggerOptions from "./swagger/swaggerOptions";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.resolve(__dirname, "../.env") });
} else {
  dotenv.config({ path: path.resolve(__dirname, "../.env.production") });
}
const JWT_SECRET = process.env.JWT_SECRET || "kingPanda";

const app = express();

const specs = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

morgan.token("date", (req, res, tz = "UTC") => {
  return moment().tz(tz.toString()).format("YYYY-MM-DD HH:mm:ss");
});

const customFormat = ":method :url :status :res[content-length] - :response-time ms - :date[Asia/Seoul]";

const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: "a" });

app.use(morgan(customFormat, { stream: accessLogStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(session({ secret: JWT_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.use("/products", productsRouter);
app.use("/articles", articlesRouter);
app.use("/images", imagesRouter);
app.use("/auth", authRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
