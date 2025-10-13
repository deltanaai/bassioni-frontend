interface SessionUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  active: boolean;
  role: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

interface Session {
  user: SessionUser;
  token: string;
}

