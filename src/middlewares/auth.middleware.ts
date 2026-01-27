import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";
import { UnauthorizedError } from "../shared/errors/UnauthorizedError";

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const token = req.cookies?.access_token;

  if (!token) {
    throw new UnauthorizedError("Unauthorized");
  }

  try {
    const payload = verifyJwt(token);
    req.user = payload;
    next();
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
}
