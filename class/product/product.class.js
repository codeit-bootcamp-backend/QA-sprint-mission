export class Product {
  #name;
  #description;
  #price;
  #hashtag;
  #liked;

  constructor(name, description, price, hashtag = [], liked = 0) {
    this.#name = name;
    this.#description = description;
    this.#price = price;
    this.#hashtag = hashtag;
    this.#liked = liked;
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

  get hashtag() {
    return this.#hashtag;
  }
  set hashtag(newHashtag) {
    this.#hashtag = newHashtag;
  }

  get liked() {
    return this.#liked;
  }

  favorite() {
    this.#liked += 1;
  }
}
