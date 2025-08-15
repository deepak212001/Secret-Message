import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(3, "Username must be atleast 2 characters")
  .max(30, "Username must be atmost 30 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters");

//   yaha  object liya hai bcz yaha pe ek se jyada check krna hai
export const singUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters" }),
});
