import { BASE_URL } from "./constants";

async function getProducts(path) {
  try {
    const res = await fetch(`${BASE_URL}${path}?pageSize=1000`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const body = await res.json();
    return body;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

async function getBestProducts(path) {
  try {
    const res = await fetch(`${BASE_URL}${path}?pageSize=4&orderBy=favorite`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const body = await res.json();
    return body;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export { getProducts, getBestProducts };
