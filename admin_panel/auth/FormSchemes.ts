import { z } from "zod";

export const loginFormSchema = z.object({
  name: z.string().min(1, "Saisissez votre nom."),
  password: z.string().min(1, "Saisissez votre mot de passe."),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
