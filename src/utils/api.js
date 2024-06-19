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

export async function postProducts(data) {
  console.log(data);
  try {
    const res = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
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

export async function postImage(image) {
  const formData = new FormData();
  formData.append("image", image);
  try {
    const res = await fetch(`${BASE_URL}/images/upload`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
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

export async function postLogin(loginData) {
  console.log(loginData);
  try {
    const res = await fetch(`${BASE_URL}/auth/signIn`, {
      method: "POST",
      body: JSON.stringify(loginData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export { getProducts, getBestProducts };
