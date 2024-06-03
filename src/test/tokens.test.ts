import { describe, expect, jest, test } from "@jest/globals";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens";

jest.mock("jsonwebtoken");

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
});
