import { PrismaClient } from "@prisma/client";
import { assert } from "superstruct";
import { CreateProduct, PatchProduct } from "./products.structs.js";

const prisma = new PrismaClient();

export async function createBoard(req, res) {}
