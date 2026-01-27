import { Request, Response } from "express";
import {
  loginService,
  logoutService,
  meService,
  refreshTokenService,
  registerService,
} from "./auth.service";
import { BadRequestError } from "../../shared/errors/BadRequestError";

export const registerUser = async (req: Request, res: Response) => {
  const user = await registerService(req.body);
  return res.status(201).json({
    success: true,
    data: user,
  });
};

export const loginUser = async (req: Request, res: Response) => {
  const data = await loginService(req.body);

  res.cookie("access_token", data.token.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.cookie("refresh_token", data.token.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({
    success: true,
    data,
  });
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.clearCookie("refresh_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  if (req.cookies?.refresh_token) {
    await logoutService(req.cookies.refresh_token);
  }

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

export const me = async (req: Request, res: Response) => {
  const { userId: id } = req.user!;
  const user = await meService(id);

  return res.status(200).json({
    success: true,
    data: user,
  });
};

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refresh_token;

  if (!refreshToken) {
    throw new BadRequestError("Refresh token is required");
  }

  const token = await refreshTokenService(refreshToken);

  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({
    success: true,
    data: token,
  });
};
