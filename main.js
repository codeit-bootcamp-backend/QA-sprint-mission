import { getProductList } from "./service/ProductService.js";
import { getArticleList } from "./service/ArticleService.js";
import { Product } from "./class/product/product.class.js";
import { ElectronicProduct } from "./class/product/electronicProduct.class.js";
import { Article } from "./class/article/article.class.js";

const { list: productList } = await getProductList();
const { list: articleList } = await getArticleList();

const product = productList.map((item) => {
  const { name, description, tags, price, favoriteCount } = item;

  if (tags.includes("전자제품")) {
    return new ElectronicProduct({
      name,
      description,
      tags,
      price,
      favoriteCount,
    });
  } else {
    return new Product({
      name,
      description,
      tags,
      price,
      favoriteCount,
    });
  }
});

const article = articleList.map((item) => {
  const { title, content, writer, likeCount } = item;

  return new Article({ title, content, writer: writer.nickname, likeCount });
});

console.log(product);
console.log(article);
