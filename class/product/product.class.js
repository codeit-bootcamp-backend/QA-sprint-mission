export class Product {
  #name;
  #description;
  #price;
  #tags;
  #favoriteCount;

  constructor({ name, description, price, tags = [], favoriteCount = 0 }) {
    this.#name = name;
    this.#description = description;
    this.#price = price;
    this.#tags = tags;
    this.#favoriteCount = favoriteCount;
  }

  get name() {
    return this.#name;
  }

  set name(newName) {
    this.#name = newName;
  }

  get description() {
    return this.#description;
  }

  set description(newDescription) {
    this.#description = newDescription;
  }

  get price() {
    return this.#price;
  }
  set price(newPrice) {
    this.#price = newPrice;
  }

  get tags() {
    return this.#tags;
  }
  set tags(newHashtag) {
    this.#tags = newHashtag;
  }

  get favoriteCount() {
    return this.#favoriteCount;
  }

  favorite() {
    this.#favoriteCount += 1;
  }
}
