import { Prisma } from "@prisma/client";

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

export default asyncHandler;
