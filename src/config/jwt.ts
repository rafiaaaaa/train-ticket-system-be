export const jwtConfig = {
  secret: process.env.JWT_SECRET!,
  refreshSecret: process.env.JWT_REFRESH_SECRET!,
  expiresIn: "1h",
  refreshExpiresIn: "7d",
};
