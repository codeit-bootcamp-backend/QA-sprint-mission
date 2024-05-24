export class Article {
  #title;
  #content;
  #writer;
  #likeCount;

  constructor({ title, content, writer, likeCount }) {
    this.#title = title;
    this.#content = content;
    this.#writer = writer;
    this.#likeCount = likeCount;
  }

  get title() {
    return this.#title;
  }

  get content() {
    return this.#content;
  }

  get writer() {
    return this.#writer;
  }

  get likeCount() {
    return this.#likeCount;
  }
}
