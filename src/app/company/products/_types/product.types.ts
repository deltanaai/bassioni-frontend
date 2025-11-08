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