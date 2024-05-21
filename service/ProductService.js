import { BASE_URL } from "../apis/config.js";

async function getProducts() {
  try {
    const response = await fetch(`${BASE_URL}/products`, { method: "GET" });
    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error("Error!");
  }
}

async function getProduct(id) {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`, { method: "GET" });
    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error("Error!");
  }
}

console.log(await getProduct(10));
