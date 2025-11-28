export interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string; 
  productName: string;
  expandedWarehouses: number[];
  onToggleWarehouse: (index: number) => void;
}

export interface AddBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBatch: (batch: Pick<WarehouseProduct, "batch_number"|"stock"| "expiry_date">) => void;
  productId?: number;
  productName?: string;
}

export interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterCategory: string;
  onCategoryChange: (value: string) => void;
  filterBrand: string;
  onBrandChange: (value: string) => void;
  productCount: number;
}

export interface ProductTableProps {
  products: MasterProduct[];
  onViewDetails: (product: MasterProduct) => void;
}


export interface ProductRequest {
  id: number;
  name_ar: string;
  name_en: string;
  status: "pending" | "approved" | "rejected";
  submitted_date: string;
  proof_document?: string;
}

export interface ProductRequestDetails extends ProductViewT {
 
  selectedcategory: Pick<CategoryViewT, "id"|"name">
  status: "pending" | "approved" | "rejected";
  proof_document_url: string;
  rejection_reason?: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: {
    id: number;
    name: string;
  };
}