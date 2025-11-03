"use client";
import { useState } from "react";

type DiscountTier = "10%" | "20%" | "30%" | "40%" | "50%" | "90%" | "custom";

interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
  unit: string;
  discount?: number;
  discountTier?: DiscountTier;
  companyId: number;
  categoryId: number;
}

interface Company {
  id: number;
  name: string;
  discountTier?: DiscountTier;
  customDiscount?: number;
}

interface Category {
  id: number;
  name: string;
}

interface OrderItem {
  productId: number;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  discount?: number;
  total: number;
}

const sampleCompanies: Company[] = [
  { id: 1, name: "شركة الأدوية المتحدة", discountTier: "30%" },
  {
    id: 2,
    name: "شركة فارما للصناعات الدوائية",
    discountTier: "50%",
    customDiscount: 45,
  },
  { id: 3, name: "شركة الرعاية الصحية المتكاملة", discountTier: "20%" },
];

const sampleCategories: Category[] = [
  { id: 1, name: "مسكنات" },
  { id: 2, name: "فيتامينات" },
  { id: 3, name: "مضادات حيوية" },
];

const sampleProducts: Product[] = [
  {
    id: 2,
    name: "إيبوبروفين 400 مجم",
    quantity: 50,
    price: 35,
    unit: "شريط",
    discountTier: "20%",
    companyId: 1,
    categoryId: 1,
  },
  {
    id: 3,
    name: "أموكسيسيلين 500 مجم",
    quantity: 1000,
    price: 50,
    unit: "شريط",
    discountTier: "90%",
    companyId: 1,
    categoryId: 3,
  },
  {
    id: 4,
    name: "فيتامين C 1000 مجم",
    quantity: 51,
    price: 40,
    unit: "علبة",
    discountTier: "10%",
    discount: 10,
    companyId: 2,
    categoryId: 2,
  },
  {
    id: 5,
    name: "زنك كبسولات",
    quantity: 4545,
    price: 55,
    unit: "علبة",
    discountTier: "40%",
    companyId: 2,
    categoryId: 2,
  },
  {
    id: 6,
    name: "شراب كحة للأطفال",
    quantity: 515,
    price: 30,
    unit: "زجاجة",
    discountTier: "50%",
    companyId: 3,
    categoryId: 3,
  },
  {
    id: 7,
    name: "مطهر جروح بيتادين",
    quantity: 545445,
    price: 20,
    unit: "زجاجة",
    discountTier: "10%",
    companyId: 3,
    categoryId: 3,
  },
];

export default function CompanyOrdersPage() {
  const [companies] = useState<Company[]>(sampleCompanies);
  const [categories] = useState<Category[]>(sampleCategories);
  const [products] = useState<Product[]>(sampleProducts);

  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [productSearch, setProductSearch] = useState<string>("");
  const [discountFilter, setDiscountFilter] = useState<string>("");
  const [quantityFilter, setQuantityFilter] = useState<string>("");
  // دالة حساب نسبة الخصم
  const calculateDiscountPercentage = (product: Product) => {
    const discountPercent =
      product.discount ?? parseInt(product.discountTier ?? "0");
    return discountPercent;
  };

  // فلترة المنتجات كلها (مش بس اللي فيها خصم)
  const filteredProducts = products
    .filter((p) => (selectedCompany ? p.companyId === selectedCompany : true))
    .filter((p) =>
      selectedCategory ? p.categoryId === selectedCategory : true
    )
    .filter(
      (p) =>
        !discountFilter ||
        calculateDiscountPercentage(p) >= parseInt(discountFilter)
    )
    .filter(
      (p) =>
        // البحث بالاسم أو بالكمية
        !productSearch ||
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.quantity.toString().includes(productSearch) // البحث بالرقم
    );

  // العروض بتكون المنتجات المفلترة اللي فيها خصم
  const bestOffers = filteredProducts
    .filter((p) => p.discount || p.discountTier)
    .sort((a, b) => {
      const discountA = calculateDiscountPercentage(a);
      const discountB = calculateDiscountPercentage(b);
      return discountB - discountA;
    });

  const calculatePriceWithDiscount = (product: Product) => {
    const discountPercent = calculateDiscountPercentage(product);
    return product.price - (product.price * discountPercent) / 100;
  };

  const addProductToOrder = (product: Product, quantity: number) => {
    if (quantity < 1) return;
    const price = calculatePriceWithDiscount(product);
    const total = price * quantity;
    const newItem: OrderItem = {
      productId: product.id,
      name: product.name,
      quantity,
      unit: product.unit,
      price,
      discount: calculateDiscountPercentage(product),
      total,
    };
    setOrderItems((prev) => [...prev, newItem]);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6">
      {/* الفلتر في الأعلى */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* فلتر الصيدليات */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              🏢 الصيدلية
            </label>
            <select
              className="w-full p-3 rounded-xl bg-gray-50 border border-gray-300 text-right focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={selectedCompany || ""}
              onChange={(e) =>
                setSelectedCompany(Number(e.target.value) || null)
              }
            >
              <option value="">جميع الصيدليات</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* فلتر الفئات */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              📦 الفئة
            </label>
            <select
              className="w-full p-3 rounded-xl bg-gray-50 border border-gray-300 text-right focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={selectedCategory || ""}
              onChange={(e) =>
                setSelectedCategory(Number(e.target.value) || null)
              }
            >
              <option value="">جميع الفئات</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* فلتر نسبة الخصم */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              💰 نسبة الخصم
            </label>
            <select
              className="w-full p-3 rounded-xl bg-gray-50 border border-gray-300 text-right focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={discountFilter}
              onChange={(e) => setDiscountFilter(e.target.value)}
            >
              <option value="">جميع العروض</option>
              <option value="10">خصم 10% فأكثر</option>
              <option value="20">خصم 20% فأكثر</option>
              <option value="30">خصم 30% فأكثر</option>
              <option value="50">خصم 50% فأكثر</option>
            </select>
          </div>

          {/* شريط البحث - يدعم الاسم والكمية  */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              🔍 بحث بالاسم أو الكمية
            </label>
            <input
              type="text"
              placeholder="ابحث بالاسم أو رقم الكمية..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-50 border border-gray-300 text-right focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* العروض في كاردات */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-right">
          🌟 أهم العروض ({bestOffers.length})
        </h2>

        {bestOffers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {bestOffers.slice(0, 8).map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="relative top-2 right-2">
                  <span className="px-2 py-1 rounded-xl text-xs font-bold bg-green-100 text-green-600">
                    {p.quantity} قطعة
                  </span>
                </div>
                <div className="p-4">
                  {/* اسم المنتج والمعلومات */}
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-800 text-sm leading-tight mb-1 line-clamp-2">
                      {p.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {companies.find((c) => c.id === p.companyId)?.name}
                    </p>
                  </div>

                  {/* السعر */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-right">
                      <div className="text-base font-bold text-emerald-600">
                        {calculatePriceWithDiscount(p)} ر.س
                      </div>
                      <div className="text-xs text-gray-400 line-through">
                        {p.price} ر.س
                      </div>
                    </div>
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold">
                      {calculateDiscountPercentage(p)}% خصم
                    </span>
                  </div>

                  {/* زر الإضافة */}
                  <button
                    onClick={() => addProductToOrder(p, 1)}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    أضف للطلب
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-200">
            <div className="max-w-md mx-auto">
              {/* أيقونة */}
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                <span className="text-4xl">😕</span>
              </div>

              {/* النص */}
              <h3 className="text-2xl font-bold text-gray-700 mb-3">
                لا توجد عروض
              </h3>
              <p className="text-gray-500 mb-6 leading-relaxed">
                لم نتمكن من العثور على عروض تطابق معايير البحث الخاصة بك. حاول
                تعديل الفلترات أو البحث بكلمات أخرى.
              </p>

              {/* نص مساعد */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-blue-700 text-sm flex items-center gap-2 justify-center">
                  <span>💡</span>
                  نصيحة: جرب إزالة بعض الفلترات للعثور على المزيد من العروض
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
