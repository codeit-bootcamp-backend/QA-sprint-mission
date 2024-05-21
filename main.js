import * as ArticleService from "./market/ArticleService.js";
import * as ProductService from "./market/ProductService.js";

await ProductService.getProducts();
await ArticleService.getArticles();
await ProductService.getProductList({ orderBy: "recent", page: 2, pageSize: 5 });
await ArticleService.getArticleList({ orderBy: "recent" });
await ArticleService.getArticleList({ orderBy: "like" });
await ProductService.getProduct(12);
await ArticleService.getArticle(1);
// await ProductService.createProduct({
//   name: "판다 인형",
//   description: "귀여운 판다 인형입니다.",
//   price: 20000,
//   tags: ["판다", "인형", "귀엽다", "포근하다", "흑백"],
//   ownerId: 5,
//   favoriteCount: 70,
// });

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const data = await ProductService.getProductList({ orderBy: "favorite", page: 1, pageSize: 4 });
    displayProductList(data.list, "best-products");
  } catch (error) {
    console.error("Error fetching products:", error);
  }
  try {
    const data = await ProductService.getProductList({ orderBy: "recent", page: 1, pageSize: 10 });
    displayProductList(data.list, "all-products");
  } catch (error) {
    console.error("Error fetching products:", error);
  }
});

function displayProductList(products, targetElement) {
  const productListElement = document.querySelector(`.${targetElement}__list`);

  if (!productListElement) {
    console.error("Error!");
    return;
  }

  productListElement.innerHTML = "";

  products.forEach((product) => {
    const productItem = document.createElement("li");
    productItem.className = `product__item ${targetElement}__item`;

    const productImage = document.createElement("img");
    productImage.src = product.images[0] || "../images/product_default.png";
    productImage.className = `product__image ${targetElement}__image`;

    const productName = document.createElement("p");
    productName.className = "products__name";
    productName.innerText = product.description;

    const productPrice = document.createElement("p");
    productPrice.className = "products__price";
    productPrice.innerText = `${product.price}원`;

    const likeButton = document.createElement("button");
    likeButton.className = "like-button";
    likeButton.innerHTML = `<img src="../icons/heart.svg" /> ${product.favoriteCount}`;

    productItem.appendChild(productImage);
    productItem.appendChild(productName);
    productItem.appendChild(productPrice);
    productItem.appendChild(likeButton);

    productListElement.appendChild(productItem);
  });
}
