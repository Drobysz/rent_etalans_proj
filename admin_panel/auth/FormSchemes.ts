import { z } from "zod";

export const loginFormSchema = z.object({
  name: z.string().min(1, "Enter your name."),
  password: z.string().min(1, "Enter your password."),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
