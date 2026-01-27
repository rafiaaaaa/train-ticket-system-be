import { email, z } from "zod";

// Register Validator
export const registerSchema = z
  .object({
    email: z.email(),
    password: z
      .string({ error: "Password is required" })
      .min(6, { error: "Password at least 6 character" }),
    confirm_password: z.string({ error: "Confirm Password is required" }),
    first_name: z
      .string({ error: "First name is required" })
      .min(1, { error: "First name at least 1 character" }),
    last_name: z
      .string()
      .min(1, { error: "Last name at least 1 character" })
      .optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type RegisterRequest = z.infer<typeof registerSchema>;

// Login Validators
export const loginSchema = z.object({
  email: z.email(),
  password: z
    .string({ error: "Password is required" })
    .min(6, { error: "Password at least 6 character" }),
});

export type LoginRequest = z.infer<typeof loginSchema>;
