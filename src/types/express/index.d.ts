declare namespace Express {
  interface User {
    accessToken: string;
    refreshToken: string;
    username: string;
    _id?: number;
  }

  interface Request {
    user?: User;
  }
}
