export interface ProductRequest {
  id: number;
  productName: string;
  companyName: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  date: string;
  details: {
    description: string;
    category: string;
    price: string;
    proofDocument: string;
  };
}

export interface Filters {
  status: string;
  company: string;
  search: string;
}

export interface Toast {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}