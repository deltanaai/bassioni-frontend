// authentication/session types.

interface SessionUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  active: boolean;
  userType?: string;
  role: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

interface Session {
  user: SessionUser | Pharmacist;
  token: string;
}
