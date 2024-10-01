import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwtUtils";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const authenticateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    try {
      const user = verifyToken(token);
      req.user = user as { id: number; email: string };
      next();
    } catch (error) {
      return res
        .status(403)
        .json({ status_code: 403, message: "Invalid token" });
    }
  } else {
    res
      .status(401)
      .json({ status_code: 401, message: "Authorization header missing" });
  }
};
