import jwt, { SignOptions } from "jsonwebtoken";
import { jwtConfig } from "../config/jwt";

const { secret, refreshSecret, expiresIn, refreshExpiresIn } = jwtConfig;
export interface JwtPayload {
  userId: string;
  email: string;
  role: "USER" | "ADMIN"; // useful when we need to differentiate between different roles, but for now it's not needed
}

export function signJwt(payload: JwtPayload) {
  return jwt.sign(payload, secret, {
    expiresIn: expiresIn as SignOptions["expiresIn"],
  });
}

export function signRefreshJwt(payload: JwtPayload) {
  return jwt.sign(payload, secret, {
    expiresIn: refreshExpiresIn as SignOptions["expiresIn"],
  });
}

export function verifyJwt(token: string): JwtPayload {
  return jwt.verify(token, secret) as JwtPayload;
}

export function verifyRefreshJwt(token: string): JwtPayload {
  return jwt.verify(token, refreshSecret) as JwtPayload;
}
