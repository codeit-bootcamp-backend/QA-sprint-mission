import pkg from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

const { sign, verify } = pkg;

// 토큰 발급
export function generateAccessToken({ nickname, email }) {
  const accessToken = sign(
    {
      nickname,
      email,
      exp: Date.now() + 1000 * 60 * 60,
    },
    process.env.JWT_SECRET
  );

  return accessToken;
}

export function generateRefreshToken({ nickname, email }) {
  const refreshToken = sign(
    {
      nickname,
      email,
      exp: Date.now() + 1000 * 60 * 60 * 60,
    },
    process.env.JWT_SECRET_REFRESH
  );

  return refreshToken;
}

export function verifyToken(token, secret) {
  // 임의의 문자열로 구성된 토큰을 Payload로 되돌림
  const decoded = verify(token, secret);

  // exp가 현재 시간 이전인 경우(만료된 토큰)
  if (decoded.exp < Date.now()) {
    return "";
  }
  // 토큰이 유효한 경우 사용자 ID 반환
  return decoded;
}

export function authValidate(req, res, next) {
  const accessToken = req.cookies["accessToken"];

  // 엑세스 토큰이 만료 여부와 별개로 존재하는지 확인
  if (accessToken) {
    const { email, nickname } = verifyToken(accessToken, process.env.JWT_SECRET);

    // 엑세스 토큰이 만료되었다면 email이 undef일 것임
    if (email) {
      // 따라서 엑세스 토큰이 만료되지 않았다면 req에 심어주기
      req.email = email;
      req.nickname = nickname;
    } else {
      // 엑세스토큰이 만료되었다면 리프레시 토큰은 상황이 어떤지 확인해보기
      const { email, nickname } = verifyToken(accessToken, process.env.JWT_SECRET_Refresh);

      // 리프레시 토큰은 살아있다면 일단 req에 하던 거 마저 심고
      if (email) {
        req.email = email;
        req.nickname = nickname;

        // 새로 엑세스 토큰과 리프레시 토큰 넣어드립시다
        const accessToken = generateAccessToken({ email, nickname });
        const refreshToken = generateRefreshToken({ email, nickname });
        res
          .cookie("accessToken", accessToken, { maxAge: 1000 * 60 * 60, httpOnly: true })
          .cookie("refreshToken", refreshToken, { maxAge: 1000 * 60 * 60 * 60, httpOnly: true });
      }
    }
  }

  next();
}
