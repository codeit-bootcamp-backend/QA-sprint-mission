const API_URL_PRODUCT = "https://panda-market-api.vercel.app/products";
export const getProducts = async () => {
  try {
    const response = await fetch(API_URL_PRODUCT);
    const data = await response.json();
    console.log("상태코드:", response.status, "Data:", data);
    return data;
  } catch (err) {
    console.error("Error!");
  }

  return data;
};

export const getProductList = async ({ page = 1, pageSize = 10, orderBy = "recent" } = {}) => {
  let query = "";
  if (page) query += `page=${page}&`;
  if (pageSize) query += `pageSize=${pageSize}&`;
  if (orderBy) query += `orderBy=${orderBy}`;
  try {
    const response = await axios.get(`${API_URL_PRODUCT}?${query}`);
    console.log("상태코드:", response.status, "Data:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error!", err.message);
  }
};

export const getProduct = async (productId) => {
  try {
    const response = await axios.get(`${API_URL_PRODUCT}/${productId}`);
    console.log("상태코드:", response.status, "Data:", response.data);
    return response.data;
  } catch (err) {
    if (err.response) {
      console.error("상태코드:", err.response.status, "Data:", err.response.data);
    } else {
      console.error("Error!", err.message);
    }
  }
};

export const createProduct = async (product) => {
  try {
    const response = await axios.post(API_URL_PRODUCT, product);
    console.log("상태코드:", response.status, "Data:", response.data);
    return response.data;
  } catch (err) {
    if (err.response) {
      console.error("상태코드:", err.response.status, "Data:", err.response.data);
    } else {
      console.error("Error!", err.message);
    }
  }
};

export const patchProduct = async (productId, product) => {
  try {
    const response = await axios.patch(`${API_URL_PRODUCT}/${productId}`, product);
    console.log("상태코드:", response.status, "Data:", response.data);
    return response.data;
  } catch (err) {
    if (err.response) {
      console.error("상태코드:", err.response.status, "Data:", err.response.data);
    } else {
      console.error("Error!", err.message);
    }
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(`${API_URL_PRODUCT}/${productId}`);
    console.log("상태코드:", response.status, "Data:", response.data);
    return response.data;
  } catch (err) {
    if (err.response) {
      console.error("상태코드:", err.response.status, "Data:", err.response.data);
    } else {
      console.error("Error!", err.message);
    }
  }
};
