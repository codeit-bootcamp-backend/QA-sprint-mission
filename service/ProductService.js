import fetcher from "../apis/instance.js";

export async function getProductList() {
  try {
    return await fetcher({ url: `/products`, method: "GET" });
  } catch (err) {
    throw new Error("Error!");
  }
}

export async function getProduct(id) {
  try {
    return await fetcher({ url: `/products/${id}`, method: "GET" });
  } catch (err) {
    throw new Error("Error!");
  }
}

export async function createProduct(product) {
  try {
    return await fetcher({ url: `/products`, method: "POST", body: JSON.stringify(product) });
  } catch (err) {
    throw new Error("Error!");
  }
}

export async function patchProduct(id, product) {
  try {
    return await fetcher({ url: `/products/${id}`, method: "PATCH", body: JSON.stringify(product) });
  } catch (err) {
    throw new Error("Error!");
  }
}

export async function deleteProduct(id) {
  try {
    return await fetcher({ url: `/products/${id}`, method: "DELETE" });
  } catch (err) {
    throw new Error("Error!");
  }
}
