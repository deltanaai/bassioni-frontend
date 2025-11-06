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

interface Session {
  user: SessionUser | Pharmacist;
  token: string;
}
