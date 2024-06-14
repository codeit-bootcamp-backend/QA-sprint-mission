import { describe, expect, jest, test } from "@jest/globals";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken, regenerateRefreshToken } from "../utils/tokens";

jest.mock("jsonwebtoken");
type JWTPayload = {
  userId: number;
};
describe("Tokens Utility", () => {
  const mockUser = { id: 1 };

  const secret = "kingPanda";

  test("access token을 생성한다", () => {
    (jwt.sign as jest.MockedFunction<typeof jwt.sign>).mockImplementation(() => "accessToken");

    const token = generateAccessToken(mockUser);

    expect(jwt.sign).toHaveBeenCalledWith({ userId: mockUser.id }, secret, { expiresIn: "15m" });
    expect(token).toBe("accessToken");
  });

  test("refresh token을 생성한다", () => {
    (jwt.sign as jest.MockedFunction<typeof jwt.sign>).mockImplementation(() => "refreshToken");

    const token = generateRefreshToken(mockUser);

    expect(jwt.sign).toHaveBeenCalledWith({ userId: mockUser.id }, secret, { expiresIn: "7d" });
    expect(token).toBe("refreshToken");
  });

  test("유효한 리프레시 토큰을 사용하여 새로운 리프레시 토큰을 생성한다", () => {
    const refreshToken = "validRefreshToken";
    const decodedToken = { userId: mockUser.id };
    (jwt.verify as jest.Mock).mockReturnValue(decodedToken as JWTPayload);
    (jwt.sign as jest.MockedFunction<typeof jwt.sign>).mockImplementation(() => "newRefreshToken");

    const token = regenerateRefreshToken(refreshToken);

    expect(jwt.verify).toHaveBeenCalledWith(refreshToken, secret);
    expect(jwt.sign).toHaveBeenCalledWith({ userId: decodedToken.userId }, secret, { expiresIn: "7d" });
    expect(token).toBe("newRefreshToken");
  });

  test("유효하지 않은 리프레시 토큰으로 인해 오류가 발생한다", () => {
    const refreshToken = "invalidRefreshToken";

    (jwt.verify as jest.MockedFunction<typeof jwt.verify>).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    expect(() => regenerateRefreshToken(refreshToken)).toThrow("Invalid refresh token");
  });
});
