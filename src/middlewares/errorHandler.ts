import AppError from "../utils/errors.js";

const errorHandler = (err, req, res, next) => {
  console.error("Error handler triggered:", err.stack);
  console.log("Response object:", res);
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "서버 오류가 발생했습니다.",
    });
  }
};

export default errorHandler;
