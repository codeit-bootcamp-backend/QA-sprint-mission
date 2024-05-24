import { Product } from "./product.class.js";

export class ElectronicProduct extends Product {
  #manufacturer;

  constructor({ name, description, price, tags, favoriteCount, manufacturer }) {
    super({ name, description, price, tags, favoriteCount });
    this.#manufacturer = manufacturer;
  }

  get manufacturer() {
    return this.#manufacturer;
  }
}
