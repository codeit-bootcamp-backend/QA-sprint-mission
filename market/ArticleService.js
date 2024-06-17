const API_URL_ARTICLE = "https://panda-market-api.vercel.app/articles";

export const getArticles = () => {
  return fetch(API_URL_ARTICLE)
    .then((response) => {
      return response.json().then((data) => {
        console.log("상태코드:", response.status, "Data:", data);
        return data;
      });
    })
    .catch((error) => {
      console.error("Error fetching articles:", error);
    });
};

export const getArticleList = async ({ page = 1, pageSize = 10, orderBy = "recent" } = {}) => {
  let query = "";
  if (page) query += `page=${page}&`;
  if (pageSize) query += `pageSize=${pageSize}&`;
  if (orderBy) query += `orderBy=${orderBy}&`;
  try {
    const response = await axios.get(`${API_URL_ARTICLE}?${query}`);
    const data = response.data;
    console.log("상태코드:", response.status, "Data:", data);
    return data;
  } catch (err) {
    console.error("Error fetching articles:", err);
  }
};

export const getArticle = async (articleId) => {
  try {
    const response = await fetch(`${API_URL_ARTICLE}/${articleId}`);
    const data = await response.json();
    console.log("상태코드:", response.status, "Data:", data);
    return data;
  } catch (err) {
    console.error("Error fetching article:", err);
  }
};

export const createArticle = async (article) => {
  try {
    const response = await fetch(API_URL_ARTICLE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(article),
    });
    const data = await response.json();
    console.log("상태코드:", response.status, "Data:", data);
    return data;
  } catch (err) {
    console.error("Error creating article:", err);
  }
};

export const patchArticle = async (articleId, article) => {
  try {
    const response = await fetch(`${API_URL_ARTICLE}/${articleId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(article),
    });
    const data = await response.json();
    console.log("상태코드:", response.status, "Data:", data);
    return data;
  } catch (err) {
    console.error("Error updating article:", err);
  }
};

export const deleteArticle = async (articleId) => {
  try {
    const response = await fetch(`${API_URL_ARTICLE}/${articleId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    console.log("상태코드:", response.status, "Data:", data);
    return data;
  } catch (err) {
    console.error("Error deleting article:", err);
  }
};
