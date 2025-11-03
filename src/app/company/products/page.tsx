"use client";
import { useState } from "react";
import { FiPackage } from "react-icons/fi";
import ProductFilters from "./Components/ProductsFilter";
import ProductTable from "./Components/ProductsTable";
import ProductDetailsModal from "./Components/ProductDetailModal";
import AddToCartModal from "./Components/AddToCartModal";
import { Product } from "./types/product.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart } from "@/lib/actions/pharma/cart.action";
import { toast } from "sonner";

const sampleProducts: Product[] = [
  {
    id: 1,
    name: "باراسيتامول 500 مجم",
    category: "مسكنات الألم",
    brand: "فارماسيا",
    dosage: "أقراص",
    concentration: "500 مجم",
    quantity: 150,
    price: 25.5,
    warehouse: "مخزن القاهرة الرئيسي",
  },
  {
    id: 2,
    name: "فيتامين سي 1000 مجم",
    category: "المكملات الغذائية",
    brand: "ناتشرال",
    dosage: "أقراص فوارة",
    concentration: "1000 مجم",
    quantity: 5,
    price: 45.0,
    warehouse: "مخزن الإسكندرية",
  },
  {
    id: 3,
    name: "أوميغا 3 كبسولات",
    category: "المكملات الغذائية",
    brand: "فيتاليف",
    dosage: "كبسولات",
    concentration: "1000 مجم",
    quantity: 120,
    price: 60.0,
    warehouse: "مخزن الجيزة",
  },
  {
    id: 4,
    name: "كريم هيدروكورتيزون 1%",
    category: "مستحضرات جلدية",
    brand: "درماسيف",
    dosage: "كريم",
    concentration: "1%",
    quantity: 60,
    price: 35.75,
    warehouse: "مخزن القاهرة الرئيسي",
  },
];

const details = {
  Productname: "كونجستال",
  warehouses: [
    {
      warehouse1: [
        { batchNumber: "3389", quantity: 24, expiryDate: "25/11/2020" },
        { batchNumber: "6667", quantity: 12, expiryDate: "16/11/2020" },
        { batchNumber: "345", quantity: 68, expiryDate: "14/8/2040" },
      ],
    },
    {
      warehouse2: [
        { batchNumber: "212", quantity: 500, expiryDate: "25/11/2070" },
        { batchNumber: "666217", quantity: 15, expiryDate: "16/11/2010" },
        { batchNumber: "34115", quantity: 20, expiryDate: "14/8/2050" },
      ],
    },
  ],
};

export default function ProductsPage() {
  const [products] = useState<Product[]>(sampleProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterBrand, setFilterBrand] = useState("all");
  const queryClient = useQueryClient();

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProductForCart, setSelectedProductForCart] =
    useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [expandedWarehouses, setExpandedWarehouses] = useState<number[]>([]);

  //مؤقتتت
  const pharmacyId = 1;

  // للسلة
  const addCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: async (res) => {
      if (!res.success) {
        toast.error(res.error?.message ?? "حدث خطأ أثناء اضافة المنتج للسلة");
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("تمت الإضافة إلى السلة بنجاح");
      handleCloseCartModal();
    },
    onError: () => {
      toast.error("حدث خطأ أثناء الإضافة");
    },
  });

  // دالة الإضافة إلى السلة
  const handleAddToCart = () => {
    if (selectedProductForCart) {
      addCartMutation.mutate({
        pharmacyId: pharmacyId,
        productId: selectedProductForCart.id,
        quantity: quantity,
      });
    }
  };

  // Filter logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;
    const matchesBrand = filterBrand === "all" || product.brand === filterBrand;
    return matchesSearch && matchesCategory && matchesBrand;
  });

  // Modal functions
  const openProductDetails = (product: Product) => setSelectedProduct(product);

  const closeProductDetails = () => {
    setSelectedProduct(null);
    setExpandedWarehouses([]);
  };

  const openCartModal = (product: Product) => {
    setSelectedProductForCart(product);
    setQuantity(1);
  };

  const handleCloseCartModal = () => {
    setSelectedProductForCart(null);
    setQuantity(1);
  };

  const toggleWarehouse = (index: number) => {
    setExpandedWarehouses((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const increaseQuantity = () => {
    if (selectedProductForCart && quantity < selectedProductForCart.quantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen text-gray-800">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
            <FiPackage className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
              إدارة المنتجات
            </h1>
            <p className="text-gray-600 text-sm">
              عرض وإدارة جميع المنتجات المتاحة
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterCategory={filterCategory}
        onCategoryChange={setFilterCategory}
        filterBrand={filterBrand}
        onBrandChange={setFilterBrand}
        productCount={filteredProducts.length}
      />

      {/* Table */}
      <ProductTable
        products={filteredProducts}
        onViewDetails={openProductDetails}
        onAddToCart={openCartModal}
      />

      {/* Modals */}
      <ProductDetailsModal
        isOpen={!!selectedProduct}
        onClose={closeProductDetails}
        productName={details.Productname}
        warehouses={details.warehouses}
        expandedWarehouses={expandedWarehouses}
        onToggleWarehouse={toggleWarehouse}
      />

      <AddToCartModal
        isOpen={!!selectedProductForCart}
        onClose={handleCloseCartModal}
        product={selectedProductForCart}
        quantity={quantity}
        onIncreaseQuantity={increaseQuantity}
        onDecreaseQuantity={decreaseQuantity}
        onAddToCart={handleAddToCart}
        isLoading={addCartMutation.isPending}
      />
    </div>
  );
}
