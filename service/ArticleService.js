import { BASE_URL } from "../apis/config.js";

export async function getArticleList() {
  return fetch(`${BASE_URL}/articles`, { method: "GET" })
    .then((res) => res.json())
    .catch(() => {
      throw new Error("Error!");
    });
}

export async function getArticle(id) {
  try {
    const response = await fetch(`${BASE_URL}/articles/${id}`, { method: "GET" });
    const res = await response.json();
    return res;
  } catch (err) {
    throw new Error("Error!");
  }
}

export async function createArticle(data) {
  try {
    const response = await fetch(`${BASE_URL}/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const res = await response.json();
    return res;
  } catch (err) {
    throw new Error("Error!");
  }
}

export async function patchArticle(id, data) {
  try {
    const response = await fetch(`${BASE_URL}/articles/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const res = await response.json();
    return res;
  } catch (err) {
    throw new Error("Error!");
  }
}

export async function deleteArticle(id) {
  try {
    const response = await fetch(`${BASE_URL}/articles/${id}`, { method: "DELETE" });
    const res = await response.json();
    return res;
  } catch (err) {
    throw new Error("Error!");
  }
}
