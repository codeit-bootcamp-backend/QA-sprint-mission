import mongoose from "mongoose";
import { DATABASE_URL } from "../env.js";
import Product from "../models/product.js";
import data from "./mock.js";

mongoose.connect(DATABASE_URL);

await Product.deleteMany({});
await Product.insertMany(data);

mongoose.connection.close();
