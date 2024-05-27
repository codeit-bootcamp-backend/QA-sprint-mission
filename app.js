import { Prisma, PrismaClient } from "@prisma/client";
import express from "express";
import multer from "multer";
import path from "path";
import { assert } from "superstruct";
import { CreateArticle, CreateComment, CreateProduct, PatchArticle, PatchComment, PatchProduct } from "./structs.js";
const SERVER_URL = "http://localhost:3000";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.post("/images/upload", upload.single("image"), async (req, res) => {
  const file = req.file;
  console.log(req);
  if (!file) {
    return res.status(400).send("이미지 파일을 선택해주세요.");
  }
  const imagePath = file.path;
  const imageUrl = `${SERVER_URL}/${imagePath.replace(/\\/g, "/")}`;
  const image = await prisma.image.create({
    data: {
      imagePath: imagePath,
    },
  });

  res.status(200).json({ url: imageUrl });
});

const asyncHandler = (handler) => {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (e) {
      if (e.name === "StructError") {
        const errors = e.failures().map((failure) => ({
          path: failure.path.join("."),
          message: failure.message,
        }));
        res.status(400).json({ message: "유효성 검사 오류입니다.", errors });
      } else if (e instanceof Prisma.PrismaClientValidationError) {
        res.status(400).json({ message: e.message });
      } else if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
        res.status(404).json({ message: "존재하지 않는 게시글입니다." });
      } else {
        console.error(e);
        res.status(500).json({ message: "서버 에러입니다." });
      }
    }
  };
};

// 상품 목록 조회
app.get(
  "/products",
  asyncHandler(async (req, res) => {
    /**
     * 쿼리 파라미터
     * - offset : 가져올 데이터의 시작 지점
     * - limit : 한 번에 가져올 데이터의 개수
     * - orderBy : 정렬 기준 favorite, recent (기본값: recent)
     * - keyword : 검색 키워드
     */
    const { offset = 0, limit = 10, orderBy = "recent", keyword = "" } = req.query;
    const order = orderBy === "favorite" ? { favoriteCount: "desc" } : { createdAt: "desc" };
    const products = await prisma.product.findMany({
      orderBy: order,
      skip: parseInt(offset),
      take: parseInt(limit),
      where: {
        OR: [
          {
            name: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: keyword,
              mode: "insensitive",
            },
          },
        ],
      },
    });
    res.send(products);
  })
);

// 상품 상세 조회
app.get(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.findUniqueOrThrow({
      where: {
        id,
      },
    });
    res.send(product);
  })
);

// 상품 등록
app.post(
  "/products",
  asyncHandler(async (req, res) => {
    assert(req.body, CreateProduct);
    const product = await prisma.product.create({
      data: req.body,
    });
    res.status(201).send(product);
  })
);

// 상품 수정
app.patch(
  "/products/:id",
  asyncHandler(async (req, res) => {
    assert(req.body, PatchProduct);
    const { id } = req.params;
    const product = await prisma.product.update({
      where: {
        id,
      },
      data: req.body,
    });

    res.send(product);
  })
);

// 상품 삭제
app.delete(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.product.delete({
      where: {
        id,
      },
    });

    res.sendStatus(204);
  })
);

// 상품 좋아요
app.patch(
  "/products/:id/like",
  asyncHandler(async (req, res) => {
    const product = await prisma.product.findUniqueOrThrow({
      where: {
        id: req.params.id,
      },
    });

    if (product.isFavorite) {
      res.status(400).send({ message: "이미 좋아요 처리된 상품입니다." });
      return;
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id: req.params.id,
      },
      data: {
        favoriteCount: {
          increment: 1,
        },
        isFavorite: true,
      },
    });

    res.send(updatedProduct);
  })
);

// 상품 좋아요 취소
app.patch(
  "/products/:id/unlike",
  asyncHandler(async (req, res) => {
    const product = await prisma.product.findUniqueOrThrow({
      where: {
        id: req.params.id,
      },
    });

    if (!product.isFavorite) {
      res.status(400).send({ message: "아직 좋아요 처리되지 않은 상품입니다." });
      return;
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id: req.params.id,
      },
      data: {
        favoriteCount: {
          decrement: 1,
        },
        isFavorite: false,
      },
    });

    res.send(updatedProduct);
  })
);

// 게시글 목록 조회
app.get(
  "/articles",
  asyncHandler(async (req, res) => {
    /**
     * 쿼리 파라미터
     * - offset : 가져올 데이터의 시작 지점
     * - limit : 한 번에 가져올 데이터의 개수
     * - orderBy : 정렬 기준 like, recent (기본값: recent)
     */
    const { offset = 0, limit = 10, orderBy = "recent", keyword = "" } = req.query;
    const order = orderBy === "like" ? { likeCount: "desc" } : { createdAt: "desc" };
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        imageUrl: true,
        createdAt: true,
        writer: true,
      },
      orderBy: order,
      skip: parseInt(offset),
      take: parseInt(limit),
      where: {
        OR: [
          {
            title: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            content: {
              contains: keyword,
              mode: "insensitive",
            },
          },
        ],
      },
    });
    // 좋아요가 많은 상위 4개의 글 조회
    const bestArticles = await prisma.article.findMany({
      orderBy: {
        likeCount: "desc",
      },
      take: 4,
    });

    res.send({ articles, bestArticles });
  })
);

// 게시글 상세 조회
app.get(
  "/articles/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const article = await prisma.article.findUniqueOrThrow({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        imageUrl: true,
        createdAt: true,
        likeCount: true,
        isLiked: true,
        writer: true,
      },
    });
    res.send(article);
  })
);

// 게시글 등록
app.post(
  "/articles",
  asyncHandler(async (req, res) => {
    assert(req.body, CreateArticle);
    const article = await prisma.article.create({
      data: req.body,
    });
    res.status(201).send(article);
  })
);

// 게시글 수정
app.patch(
  "/articles/:id",
  asyncHandler(async (req, res) => {
    assert(req.body, PatchArticle);
    const { id } = req.params;
    const article = await prisma.article.update({
      where: {
        id,
      },
      data: req.body,
    });

    res.send(article);
  })
);

// 게시글 삭제
app.delete(
  "/articles/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.article.delete({
      where: {
        id,
      },
    });

    res.sendStatus(204);
  })
);

// 게시글 좋아요
app.patch(
  "/articles/:id/like",
  asyncHandler(async (req, res) => {
    const article = await prisma.article.findUniqueOrThrow({
      where: {
        id: req.params.id,
      },
    });

    if (article.isLiked) {
      res.status(400).send({ message: "이미 좋아요 처리된 게시글입니다." });
      return;
    }

    const updatedArticle = await prisma.article.update({
      where: {
        id: req.params.id,
      },
      data: {
        likeCount: {
          increment: 1,
        },
        isLiked: true,
      },
    });

    res.send(updatedArticle);
  })
);

// 게시글 좋아요 취소
app.patch(
  "/articles/:id/unlike",
  asyncHandler(async (req, res) => {
    const article = await prisma.article.findUniqueOrThrow({
      where: {
        id: req.params.id,
      },
    });

    if (!article.isLiked) {
      res.status(400).send({ message: "아직 좋아요 처리되지 않은 게시글입니다." });
      return;
    }

    const updatedArticle = await prisma.article.update({
      where: {
        id: req.params.id,
      },
      data: {
        likeCount: {
          decrement: 1,
        },
        isLiked: false,
      },
    });

    res.send(updatedArticle);
  })
);

// 중고마켓 댓글 목록 조회
app.get(
  "/products/:id/comments",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { cursor } = req.query;
    let queryOptions = {
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        productId: id,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        writer: true,
      },
    };

    if (cursor) {
      queryOptions = {
        ...queryOptions,
        cursor: {
          id: cursor,
        },
        skip: 1,
      };
    }

    const comments = await prisma.comment.findMany(queryOptions);
    res.send(comments);
  })
);

// 중고마켓 댓글 등록
app.post(
  "/products/:id/comments",
  asyncHandler(async (req, res) => {
    assert(req.body, CreateComment);
    const { id } = req.params;

    const comment = await prisma.comment.create({
      data: {
        ...req.body,
        productId: id,
      },
    });
    res.status(201).send(comment);
  })
);

// 중고마켓 댓글 수정
app.patch(
  "/products/:id/comments/:commentId",
  asyncHandler(async (req, res) => {
    assert(req.body, PatchComment);
    const { commentId } = req.params;
    const comment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: req.body,
    });

    res.send(comment);
  })
);

// 중고마켓 댓글 삭제
app.delete(
  "/products/:id/comments/:commentId",
  asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    res.sendStatus(204);
  })
);

// 자유게시판 댓글 목록 조회
app.get(
  "/articles/:id/comments",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { cursor } = req.query;
    let queryOptions = {
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        articleId: id,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        writer: true,
      },
    };

    if (cursor) {
      queryOptions = {
        ...queryOptions,
        cursor: {
          id: cursor,
        },
        skip: 1,
      };
    }

    const comments = await prisma.comment.findMany(queryOptions);
    res.send(comments);
  })
);

// 자유게시판 댓글 등록
app.post(
  "/articles/:id/comments",
  asyncHandler(async (req, res) => {
    assert(req.body, CreateComment);
    const { id } = req.params;

    const comment = await prisma.comment.create({
      data: {
        ...req.body,
        articleId: id,
      },
    });
    res.status(201).send(comment);
  })
);

// 자유게시판 댓글 수정
app.patch(
  "/articles/:id/comments/:commentId",
  asyncHandler(async (req, res) => {
    assert(req.body, PatchComment);
    const { commentId } = req.params;
    const comment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: req.body,
    });

    res.send(comment);
  })
);

// 중고마켓 댓글 삭제
app.delete(
  "/articles/:id/comments/:commentId",
  asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    res.sendStatus(204);
  })
);

app.listen(process.env.PORT || 3000, () => console.log("Server Started"));
