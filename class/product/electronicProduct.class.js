import { Product } from "./product.class";

export class ElectronicProduct extends Product {
#manufacturer

  constructor(name, description, price, hashtag, liked, manufacturer) {
    super(name, description, price, hashtag, liked);
    this.#manufacturer = manufacturer;
  }

  get manufacturer() {
    return this.#manufacturer
  }
}