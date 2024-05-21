export class Article {
  #title;
  #description;
  #author;
  #liked;
  
  constructor(title, description, author, liked) {
    this.#title = title;
    this.#description = description;
    this.#author = author;
    this.#liked = liked
  }

  get title() {
    return this.#title
  }

  get description() {
    return this.#description
  }
  get author() {
    return this.#author;
  }

  get liked() {
    return this.#liked
  }
}