import { z } from "zod";

export const singInSchema = z.object({
  identifier: z.string, // email ya username ke se koi ek se login
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters" }),
});
