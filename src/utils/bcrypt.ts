import bcrypt from "bcrypt";

export const bcryptHash = (string: string) => {
  return bcrypt.hash(string, 10);
};

export const bcryptCompare = (string: string, hash: string) => {
  return bcrypt.compare(string, hash);
};
