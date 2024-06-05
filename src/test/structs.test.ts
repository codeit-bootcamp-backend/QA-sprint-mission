import { describe, expect, jest, test } from "@jest/globals";
import * as s from "superstruct";
import {
  CreateArticle,
  CreateComment,
  CreateProduct,
  CreateUser,
  PatchArticle,
  PatchComment,
  PatchProduct,
} from "../structs";

jest.mock("is-email", () => {
  return jest.fn(() => true);
});

describe("구조체 유효성 검사", () => {
  test("유효한 CreateProduct 객체를 검증한다", () => {
    const validProduct = {
      tags: ["tag1"],
      price: 999,
      description: "유효한 설명",
      name: "유효한 제품 이름",
      imageUrl: "http://example.com/image.jpg",
    };

    expect(() => s.assert(validProduct, CreateProduct)).not.toThrow();
  });

  test("유효하지 않은 CreateProduct 객체를 검증한다", () => {
    const invalidProduct = {
      tags: [""],
      price: -1,
      description: "",
      name: "",
    };

    expect(() => s.assert(invalidProduct, CreateProduct)).toThrow();
  });

  test("유효한 PatchProduct 객체를 검증한다", () => {
    const validPatch = {
      price: 100,
    };

    expect(() => s.assert(validPatch, PatchProduct)).not.toThrow();
  });

  test("유효하지 않은 PatchProduct 객체를 검증한다", () => {
    const invalidPatch = {
      price: -100,
    };

    expect(() => s.assert(invalidPatch, PatchProduct)).toThrow();
  });

  test("유효한 CreateArticle 객체를 검증한다", () => {
    const validArticle = {
      title: "유효한 제목",
      content: "유효한 내용",
      imageUrl: "http://example.com/image.jpg",
      writer: "작성자",
    };

    expect(() => s.assert(validArticle, CreateArticle)).not.toThrow();
  });

  test("유효하지 않은 CreateArticle 객체를 검증한다", () => {
    const invalidArticle = {
      title: "",
      content: "",
    };

    expect(() => s.assert(invalidArticle, CreateArticle)).toThrow();
  });

  test("유효한 PatchArticle 객체를 검증한다", () => {
    const validPatch = {
      title: "유효한 제목",
    };

    expect(() => s.assert(validPatch, PatchArticle)).not.toThrow();
  });

  test("유효하지 않은 PatchArticle 객체를 검증한다", () => {
    const invalidPatch = {
      title: "",
    };

    expect(() => s.assert(invalidPatch, PatchArticle)).toThrow();
  });

  test("유효한 CreateComment 객체를 검증한다", () => {
    const validComment = {
      content: "유효한 내용",
      writer: "댓글 작성자",
    };

    expect(() => s.assert(validComment, CreateComment)).not.toThrow();
  });

  test("유효하지 않은 CreateComment 객체를 검증한다", () => {
    const invalidComment = {
      content: null,
    };

    expect(() => s.assert(invalidComment, CreateComment)).toThrow();
  });

  test("유효한 PatchComment 객체를 검증한다", () => {
    const validPatch = {
      content: "유효한 내용",
    };

    expect(() => s.assert(validPatch, PatchComment)).not.toThrow();
  });

  test("유효하지 않은 PatchComment 객체를 검증한다", () => {
    const invalidPatch = {
      content: null,
    };

    expect(() => s.assert(invalidPatch, PatchComment)).toThrow();
  });

  test("유효한 CreateUser 객체를 검증한다", () => {
    const validUser = {
      email: "test@example.com",
      password: "validpassword",
      name: "유효한 이름",
      nickname: "닉네임",
    };

    expect(() => s.assert(validUser, CreateUser)).not.toThrow();
  });

  test("유효하지 않은 CreateUser 객체를 검증한다", () => {
    const invalidUser = {
      email: "invalid-email",
      password: "",
      name: "",
      nickname: "",
    };

    expect(() => s.assert(invalidUser, CreateUser)).toThrow();
  });
});
