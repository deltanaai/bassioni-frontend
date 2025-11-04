// types/product.types.ts
export interface Product {
  id: number;
  name: string;
  category: {
    id: number;
    name: string;
    position: number;
    active: boolean;
    show_home: boolean;
  } | string; // يمكن أن يكون كائن أو نص
  brand: string;
  description: string;
  price: number;
  imageUrl: string | null;
  active: boolean;
  rating: number;
  rating_count: number;
  createdAt: string;
  updatedAt: string;
  // الحقول الإضافية من الـ API
  concentration?: string;
  quantity?: number;
  warehouse?: string;
}
export interface Batch {
  id?: number;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
}

export interface WarehouseProduct {
  id: number;
  warehouseId: number;
  warehouseName: string;
  productId: number;
  batches: Batch[];
  totalQuantity: number;
}

export interface MasterProduct {
  id: number;
  name: string;
  description: string;
  brand: string;
  category: {
    id: number;
    name: string;
  };
  price: number;
  imageUrl: string | null;
  active: boolean;
  rating: number;
  rating_count: number;
}

export interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string; 
  productName: string;
  expandedWarehouses: number[];
  onToggleWarehouse: (index: number) => void;
  // تم إزالة warehouses تماماً
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
  productId?: string;
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