declare namespace Express {
  interface User {
    accessToken: string;
    refreshToken: string;
  }

  interface Request {
    user?: User;
  }
}
