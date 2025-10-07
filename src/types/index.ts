import { loginSchema } from "@/schemas/login";
import z from "zod";

export type LoginFormData = z.infer<typeof loginSchema>;
