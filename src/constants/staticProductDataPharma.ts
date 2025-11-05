
export interface Batch {
    batchNumber: string;
    quantity: number;
    expiryDate: string;
  }
  
  export interface Warehouse {
    id: number;
    name: string;
    batches: Batch[];
    totalQuantity: number;
  }
  
  export interface ProductDetails {
    id: string;
    name: string;
    description: string;
    category: string;
    brand: string;
    price: number;
    rating: number;
    rating_count: number;
    createdAt: string;
    active: boolean;
  }
  
  // بيانات استاتيك للمخازن والدفعات
  export const staticWarehouses: Warehouse[] = [
    {
      id: 1,
      name: "المخزن الرئيسي - القاهرة",
      totalQuantity: 450,
      batches: [
        { batchNumber: "BATCH-2024-001", quantity: 200, expiryDate: "2025-12-31" },
        { batchNumber: "BATCH-2024-002", quantity: 150, expiryDate: "2025-08-15" },
        { batchNumber: "BATCH-2024-003", quantity: 100, expiryDate: "2025-06-30" }
      ]
    },
    {
      id: 2,
      name: "مخزن الجيزة",
      totalQuantity: 280,
      batches: [
        { batchNumber: "BATCH-2024-004", quantity: 120, expiryDate: "2025-11-20" },
        { batchNumber: "BATCH-2024-005", quantity: 160, expiryDate: "2025-09-10" }
      ]
    },
    {
      id: 3,
      name: "مخزن الإسكندرية",
      totalQuantity: 190,
      batches: [
        { batchNumber: "BATCH-2024-006", quantity: 90, expiryDate: "2025-10-05" },
        { batchNumber: "BATCH-2024-007", quantity: 100, expiryDate: "2025-07-22" }
      ]
    },
    {
      id: 4,
      name: "مخزن المنصورة",
      totalQuantity: 320,
      batches: [
        { batchNumber: "BATCH-2024-008", quantity: 200, expiryDate: "2025-12-15" },
        { batchNumber: "BATCH-2024-009", quantity: 120, expiryDate: "2025-08-30" }
      ]
    }
  ];
  
  // دالة لإنشاء بيانات المنتج
  export const getProductDetails = (productId: string, productName: string): ProductDetails => ({
    id: productId,
    name: productName,
    description: "منتج طبي عالي الجودة يستخدم في علاج الحالات المختلفة. يتميز بفاعلية كبيرة وأمان عالي.",
    category: "أدوية القلب",
    brand: "فارماسيا",
    price: 85.50,
    rating: 4.7,
    rating_count: 234,
    createdAt: "2024-01-15",
    active: true
  });
  
 