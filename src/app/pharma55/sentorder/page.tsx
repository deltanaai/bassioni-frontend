'use client';
import { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';

// أنواع
 type OrderStatus = 'pending' | 'approved' | 'rejected' | 'in_progress' | 'delivered';
 type DiscountTier = '10%' | '20%' | '30%' | '40%' | '50%' | '90%' | 'custom';

interface Product {
  id: number;
  name: string;
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

interface Order {
  id: number;
  company: string;
  companyId: number;
  items: OrderItem[];
  total: number;
  orderDate: string;
  status: OrderStatus;
  notes?: string;
}

// بيانات تجريبية
const sampleCompanies: Company[] = [
  { id: 1, name: 'شركة الأدوية المتحدة', discountTier: '30%' },
  { id: 2, name: 'شركة فارما للصناعات الدوائية', discountTier: '50%', customDiscount: 45 },
  { id: 3, name: 'شركة الرعاية الصحية المتكاملة', discountTier: '20%' },
];

const sampleCategories: Category[] = [
  { id: 1, name: 'مسكنات' },
  { id: 2, name: 'فيتامينات' },
  { id: 3, name: 'مضادات حيوية' },
];

const sampleProducts: Product[] = [
  { id: 1, name: 'باراسيتامول 500 مجم', price: 25, unit: 'شريط', discount: 5, companyId: 1, categoryId: 1 },
  { id: 2, name: 'إيبوبروفين 400 مجم', price: 35, unit: 'شريط', discountTier: '20%', companyId: 1, categoryId: 1 },
  { id: 3, name: 'أموكسيسيلين 500 مجم', price: 50, unit: 'شريط', companyId: 1, categoryId: 3 },
  { id: 4, name: 'فيتامين C 1000 مجم', price: 40, unit: 'علبة', discount: 10, companyId: 2, categoryId: 2 },
  { id: 5, name: 'زنك كبسولات', price: 55, unit: 'علبة', discountTier: '40%', companyId: 2, categoryId: 2 },
  { id: 6, name: 'شراب كحة للأطفال', price: 30, unit: 'زجاجة', companyId: 3, categoryId: 3 },
  { id: 7, name: 'مطهر جروح بيتادين', price: 20, unit: 'زجاجة', discountTier: '10%', companyId: 3, categoryId: 3 },
];

export default function CompanyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [companies] = useState<Company[]>(sampleCompanies);
  const [categories] = useState<Category[]>(sampleCategories);
  const [products] = useState<Product[]>(sampleProducts);

  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [productSearch, setProductSearch] = useState<string>('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [notes, setNotes] = useState<string>('');

  // المنتجات المعروضة
  const availableProducts = products.filter(
    (p) => (!selectedCompany || p.companyId === selectedCompany) &&
           (!selectedCategory || p.categoryId === selectedCategory) &&
           p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  // العروض (Top offers)
  const bestOffers = products
    .filter((p) => p.discount || p.discountTier)
    .filter((p) => (selectedCompany ? p.companyId === selectedCompany : true))
    .sort((a, b) => {
      const getDisc = (x: Product) =>
        x.discount ? x.discount : x.discountTier ? parseInt(x.discountTier) : 0;
      return getDisc(b) - getDisc(a);
    });

  // حساب السعر بعد الخصم
  const calculatePriceWithDiscount = (product: Product) => {
    let discountValue = 0;
    if (product.discount) discountValue = product.discount;
    else if (product.discountTier)
      discountValue = (parseInt(product.discountTier) / 100) * product.price;
    return Math.max(0, product.price - discountValue);
  };

  // إضافة منتج
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
      discount: product.discount
        ? product.discount
        : product.discountTier
        ? (parseInt(product.discountTier) / 100) * product.price
        : 0,
      total,
    };

    setOrderItems((prev) => [...prev, newItem]);
  };

  const removeOrderItem = (index: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const calculateOrderTotal = () =>
    orderItems.reduce((s, it) => s + it.total, 0);

  const submitOrder = () => {
    if (!selectedCompany || orderItems.length === 0) return;
    const comp = companies.find((c) => c.id === selectedCompany)!;

    const newOrder: Order = {
      id: orders.length + 1,
      company: comp.name,
      companyId: comp.id,
      items: orderItems,
      total: calculateOrderTotal(),
      orderDate: new Date().toLocaleString('ar-EG'),
      status: 'pending',
      notes,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setOrderItems([]);
    setNotes('');
    setSelectedCompany(null);
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Column 1: الشركات والتصنيفات */}
        <aside className="lg:col-span-1 bg-gray-800 p-4 rounded-2xl space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2 text-right">الشركات</h2>
            <select
              className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-right"
              value={selectedCompany || ''}
              onChange={(e) => setSelectedCompany(Number(e.target.value) || null)}
            >
              <option value="">اختر الشركة...</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2 text-right">التصنيفات</h2>
            <select
              className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-right"
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(Number(e.target.value) || null)}
            >
              <option value="">اختر التصنيف...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2 text-right">بحث</h2>
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-right"
            />
          </div>
        </aside>

        {/* Column 2+3: العروض والمنتجات */}
        <main className="lg:col-span-2 space-y-6">
          {/* العروض */}
          <section className="bg-gray-800 p-4 rounded-2xl">
            <h2 className="text-lg font-semibold text-yellow-300 mb-4">
              أهم العروض
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {bestOffers.slice(0, 6).map((p) => (
                <div
                  key={p.id}
                  className="p-3 bg-gray-700 rounded-xl flex flex-col justify-between"
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-sm text-gray-400">
                        {companies.find((c) => c.id === p.companyId)?.name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">
                        {calculatePriceWithDiscount(p)} ر.س
                      </div>
                      <div className="text-xs text-gray-400 line-through">
                        {p.price} ر.س
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-between">
                    <button
                      onClick={() => addProductToOrder(p, 1)}
                      className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm"
                    >
                      أضف للطلب
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* المنتجات */}
          <section className="bg-gray-800 p-4 rounded-2xl">
            <h2 className="text-lg font-semibold text-green-400 mb-4">
              المنتجات
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {availableProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-3 bg-gray-700 rounded-xl flex flex-col justify-between"
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-sm text-gray-400">
                        {companies.find((c) => c.id === p.companyId)?.name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">
                        {calculatePriceWithDiscount(p)} ر.س
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-between items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      defaultValue={1}
                      className="w-16 p-1 text-black rounded"
                      id={`qty-${p.id}`}
                    />
                    <button
                      onClick={() => {
                        const qtyInput = document.getElementById(`qty-${p.id}`) as HTMLInputElement;
                        const qty = parseInt(qtyInput.value, 10);
                        addProductToOrder(p, qty);
                      }}
                      className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm"
                    >
                      أضف للطلب
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Column 4: ملخص الطلب */}
        <aside className="lg:col-span-1 bg-gray-800 p-4 rounded-2xl">
          <h2 className="text-lg font-semibold mb-3">ملخص الطلب الحالي</h2>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {orderItems.map((it, idx) => (
              <div
                key={idx}
                className="p-2 bg-gray-700 rounded-lg flex justify-between"
              >
                <div className="text-right">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm text-gray-400">
                    {it.quantity} × {it.price} ر.س
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="font-bold">{it.total} ر.س</div>
                  <button
                    onClick={() => removeOrderItem(idx)}
                    className="text-red-400"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-gray-900 p-3 rounded-lg">
            <div className="flex justify-between mb-2">
              <div className="text-sm text-gray-400">الإجمالي</div>
              <div className="font-bold text-lg">{calculateOrderTotal()} ر.س</div>
            </div>
            <button
              onClick={submitOrder}
              disabled={orderItems.length === 0 || !selectedCompany}
              className="w-full py-2 rounded-lg bg-blue-600 text-white"
            >
              إرسال الطلب
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
