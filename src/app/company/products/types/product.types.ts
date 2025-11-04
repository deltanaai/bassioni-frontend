export interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;
  dosage: string;
  concentration: string;
  quantity: number;
  price: number;
  warehouse: string;
}

export interface Batch {
  id?: number;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
}

export interface Warehouse {
  warehouse1?: Batch[];
  warehouse2?: Batch[];
}

export interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  warehouses: Warehouse[];
  expandedWarehouses: number[];
  onToggleWarehouse: (index: number) => void;
}

export interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  quantity: number;
  onIncreaseQuantity: () => void;
  onDecreaseQuantity: () => void;
  onAddToCart: () => void;
  isLoading?: boolean; 

}

export interface AddBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBatch: (batch: Batch) => void;
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
  products: Product[];
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}