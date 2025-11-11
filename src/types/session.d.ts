// authentication/session types.

import { loginSchema } from "@/schemas/auth";
import z from "zod";

declare global {
  interface SessionUser {
    id: number;
    name: string;
    email: string;
    phone?: string;
    active: boolean;
    userType?: "Pharma" | "Owner" | "Company";
    imageUrl?: string;
    image?: string | null;
    pharmacy?: Pharmacy;
    role: string;
    address?: string;
    createdAt: string;
    updatedAt: string;
  }

  interface Pharmacist {
    id: number;
    name: string;
    phone: string;
    email: string;
    pharmacy: Pharmacy;
    imageUrl: string;
    image: string | null;
    createdAt: string;
    updatedAt: string;
  }

  interface Admin {
    id: number;
    name: string;
    email: string;
    superAdmin: boolean;
  }

  interface Session {
    user: SessionUser;
    token: string;
  }

  type Credentials = z.infer<typeof loginSchema>;
}

export {};
