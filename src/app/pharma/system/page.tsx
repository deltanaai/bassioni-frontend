// pages/orders.tsx
'use client';

import React, { useState, useMemo } from 'react';
import {
  User,
  Phone,
  CreditCard,
  UploadCloud,
  Plus,
  Search,
} from 'lucide-react';

type Product = { id: number; name: string; price: number };
type CartItem = { id: number; name: string; price: number; qty: number };

export default function OrdersPage() {
  // ----- بيانات ثابتة تجريبية -----
  const initialMyProducts: Product[] = [
    { id: 1, name: 'بانادول', price: 12 },
    { id: 2, name: 'كتافلام', price: 25 },
    { id: 3, name: 'فيتامين سي حقنة', price: 40 },
    { id: 4, name: 'دواء سعال', price: 18 },
  ];

type CompanyName = "شركة النور" | "شركة الحياة" | "شركة الأمل";

const companies: Record<CompanyName, string[]> = {
  "شركة النور": ["منتج نور A", "منتج نور B", "منتج نور C"],
  "شركة الحياة": ["منتج حياة 1", "منتج حياة 2"],
  "شركة الأمل": ["منتج أمل X", "منتج أمل Y", "منتج أمل Z"],
};


  const paymentMethods = ['كاش', 'فيزا', 'مدى', 'Apple Pay'];

  // ----- state عام -----
  const [activeTab, setActiveTab] = useState<'order' | 'items' | 'exchange'>('order');

  // Order tab state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [myProducts] = useState<Product[]>(initialMyProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<string>('');

  // Items tab state (file + modal)
  const [excelFileName, setExcelFileName] = useState<string | null>(null);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');

  // Exchange tab state
  const [selectedMyProducts, setSelectedMyProducts] = useState<CartItem[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [companySearch, setCompanySearch] = useState('');
  const [selectedCompanyProducts, setSelectedCompanyProducts] = useState<{ name: string; qty: number }[]>([]);

  // ----- derived -----
  const total = useMemo(
    () => cart.reduce((s, it) => s + it.price * it.qty, 0),
    [cart]
  );

  // ----- order tab helpers -----
  function addProductToCart(prod: Product) {
    setCart((prev) => {
      const found = prev.find((p) => p.id === prod.id);
      if (found) return prev.map((p) => (p.id === prod.id ? { ...p, qty: p.qty + 1 } : p));
      return [...prev, { id: prod.id, name: prod.name, price: prod.price, qty: 1 }];
    });
  }

  function updateCartQty(id: number, qty: number) {
    if (qty <= 0) {
      setCart((prev) => prev.filter((p) => p.id !== id));
      return;
    }
    setCart((prev) => prev.map((p) => (p.id === id ? { ...p, qty } : p)));
  }

  function removeCartItem(id: number) {
    setCart((prev) => prev.filter((p) => p.id !== id));
  }

  function submitOrder() {
    if (!customerName.trim()) return alert('اكتب اسم العميل');
    if (!customerPhone.trim()) return alert('اكتب رقم الهاتف');
    if (cart.length === 0) return alert('اضف منتج واحد على الأقل');
    if (!selectedPayment) return alert('اختر وسيلة دفع');

    const order = {
      customerName,
      customerPhone,
      items: cart,
      payment: selectedPayment,
      total,
      createdAt: new Date().toISOString(),
    };

    console.log('تم حفظ الطلب (محلي):', order);
    alert('تم إنشاء الطلب بنجاح (راجع الكونسول)');
    // تنظيف الفورم
    setCustomerName('');
    setCustomerPhone('');
    setCart([]);
    setSelectedPayment('');
  }

  // ----- items tab helpers -----
  function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setExcelFileName(f.name);
    // لاحقاً: هنا تقدر تبعت الملف ل API أو تقرأه مع xlsx
  }

  function saveNewItem() {
    if (!newItemName.trim()) return alert('اكتب اسم الصنف');
    // نحاكي الحفظ بإضافة للصنف المحلي
    const newId = myProducts.length + Math.floor(Math.random() * 1000) + 1;
    myProducts.push({ id: newId, name: newItemName.trim(), price: 0 });
    setNewItemName('');
    setShowAddItemModal(false);
    alert('تم إضافة الصنف محلياً (تحديث الصفحة يظهره في المنتجات)');
  }

  // ----- exchange tab helpers -----
  function toggleSelectMyProduct(prod: Product) {
    const found = selectedMyProducts.find((p) => p.id === prod.id);
    if (found) {
      setSelectedMyProducts((prev) => prev.filter((p) => p.id !== prod.id));
    } else {
      setSelectedMyProducts((prev) => [...prev, { id: prod.id, name: prod.name, price: prod.price, qty: 1 }]);
    }
  }

  function setMyProductQty(id: number, qty: number) {
    setSelectedMyProducts((prev) => prev.map((p) => (p.id === id ? { ...p, qty } : p)));
  }

  function selectCompany(name: string) {
    setSelectedCompany(name);
    setCompanySearch('');
    setSelectedCompanyProducts([]);
  }

  function addCompanyProduct(name: string) {
    if (selectedCompanyProducts.find((p) => p.name === name)) return;
    setSelectedCompanyProducts((prev) => [...prev, { name, qty: 1 }]);
  }

  function setCompanyProductQty(name: string, qty: number) {
    setSelectedCompanyProducts((prev) => prev.map((p) => (p.name === name ? { ...p, qty } : p)));
  }

  function confirmExchange() {
    if (selectedMyProducts.length === 0) return alert('اختر منتج/منتجات من عندك');
    if (!selectedCompany) return alert('اختر الشركة');
    if (selectedCompanyProducts.length === 0) return alert('اختر منتجات من الشركة المقابلة');

    // مبداي: نتأكد أن مجموع كميات كل جهة متاح — هنا فقط نعرض:
    console.log('بدل تم إنشاؤه:', {
      fromMy: selectedMyProducts,
      company: selectedCompany,
      fromCompany: selectedCompanyProducts,
      createdAt: new Date().toISOString(),
    });
    alert('تم إنشاء طلب البدل (راجع الكونسول)');
    // تنظيف
    setSelectedMyProducts([]);
    setSelectedCompany('');
    setSelectedCompanyProducts([]);
    setCompanySearch('');
  }


  
const companyAvailableProducts = useMemo(() => {
  if (!selectedCompany || !(selectedCompany in companies)) return [];

  const list = companies[selectedCompany as CompanyName] ?? [];

  const search = companySearch.trim().toLowerCase();
  if (!search) return list;

  return list.filter((product) =>
    product.toLowerCase().includes(search)
  );
}, [selectedCompany, companySearch]);


  // ----- UI -----
  return (
    <div className="p-6 min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-emerald-400">نظام الطلبات</h1>
            <p className="text-gray-300 mt-1">إدارة الطلبات — إنشاء / أصناف / بدل</p>
          </div>
          <nav className="flex gap-2 bg-gray-900 rounded-2xl p-1">
            <button
              onClick={() => setActiveTab('order')}
              className={`px-5 py-2 rounded-2xl text-sm font-medium transition ${activeTab === 'order' ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
            >
              إنشاء طلب
            </button>
            <button
              onClick={() => setActiveTab('items')}
              className={`px-5 py-2 rounded-2xl text-sm font-medium transition ${activeTab === 'items' ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
            >
              الأصناف
            </button>
            <button
              onClick={() => setActiveTab('exchange')}
              className={`px-5 py-2 rounded-2xl text-sm font-medium transition ${activeTab === 'exchange' ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
            >
              البدل
            </button>
          </nav>
        </header>

        <main className="bg-gray-900 rounded-2xl p-6 shadow-lg">
          {/* ---------------- ORDER TAB ---------------- */}
          {activeTab === 'order' && (
            <section className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-2 space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-emerald-400" />
                    <input
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="اسم العميل"
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-emerald-400" />
                    <input
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="رقم الهاتف"
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
                      inputMode="tel"
                    />
                  </div>

                  <div>
                    <p className="text-gray-300 mb-2 font-medium">اختر منتجاتك (اضغط لإضافة / اضبط الكمية)</p>
                    <div className="flex flex-wrap gap-2">
                      {myProducts.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => addProductToCart(p)}
                          className="px-3 py-2 rounded-xl bg-gray-800 hover:bg-emerald-600 transition text-sm"
                        >
                          {p.name} — {p.price} ر.س
                        </button>
                      ))}
                    </div>
                  </div>

                  {cart.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="bg-gray-800 rounded-xl p-3 border border-gray-700">
                        {cart.map((it) => (
                          <div key={it.id} className="flex items-center gap-3 justify-between py-2 border-b border-gray-800 last:border-b-0">
                            <div>
                              <div className="font-medium text-white">{it.name}</div>
                              <div className="text-sm text-gray-400">{it.price} ر.س لكل وحدة</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min={1}
                                value={it.qty}
                                onChange={(e) => updateCartQty(it.id, Number(e.target.value))}
                                className="w-20 px-3 py-1 rounded-lg bg-gray-900 text-white border border-gray-700"
                              />
                              <div className="text-sm text-gray-300">{(it.price * it.qty).toLocaleString()} ر.س</div>
                              <button onClick={() => removeCartItem(it.id)} className="text-sm text-red-400 px-2 py-1 rounded hover:bg-gray-800">حذف</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <aside className="space-y-4">
                  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <h3 className="text-gray-200 font-semibold mb-2">وسيلة الدفع</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {paymentMethods.map((m) => (
                        <button
                          key={m}
                          onClick={() => setSelectedPayment(m)}
                          className={`text-sm px-3 py-2 rounded-lg text-left ${selectedPayment === m ? 'bg-emerald-600' : 'bg-gray-900 hover:bg-gray-800'} transition`}
                        >
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-emerald-200" />
                            <span>{m}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-right">
                    <div className="text-gray-400 text-sm">الإجمالي</div>
                    <div className="text-2xl font-bold text-emerald-300">{total.toLocaleString()} ر.س</div>
                    <button onClick={submitOrder} className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 py-2 rounded-xl font-semibold">
                      حفظ الطلب
                    </button>
                  </div>
                </aside>
              </div>
            </section>
          )}

          {/* ---------------- ITEMS TAB ---------------- */}
          {activeTab === 'items' && (
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <UploadCloud className="w-6 h-6 text-emerald-400" />
                <h2 className="text-xl font-semibold">رفع ملف Excel لإضافة أصناف</h2>
              </div>

              <div className="flex gap-3 items-center">
                <input type="file" accept=".xlsx,.xls" onChange={onFileSelected} className="hidden" id="excelFile" />
                <label htmlFor="excelFile" className="cursor-pointer px-4 py-2 rounded-xl bg-gray-800 hover:bg-emerald-600">
                  اختيار ملف
                </label>
                <div className="text-gray-300">{excelFileName ?? 'لم يتم اختيار ملف'}</div>

                <button onClick={() => setShowAddItemModal(true)} className="ml-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> إضافة صنف يدوي
                </button>
              </div>

              <div className="text-sm text-gray-400">
                ملاحظة: حالياً يتم حفظ أسماء الملفات محليًا. إذا حابب، أقدر أضيف قراءة الملف ورفع البيانات للسيرفر (xlsx).
              </div>
            </section>
          )}

          {/* ---------------- EXCHANGE TAB ---------------- */}
          {activeTab === 'exchange' && (
            <section className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">اختيار منتجاتك</h2>
                <p className="text-gray-400 text-sm mb-2">اضغط على المنتج لإضافته لقائمة البدل ثم اضبط الكمية.</p>
                <div className="flex flex-wrap gap-2">
                  {myProducts.map((p) => {
                    const selected = selectedMyProducts.some((s) => s.id === p.id);
                    return (
                      <button
                        key={p.id}
                        onClick={() => toggleSelectMyProduct(p)}
                        className={`px-3 py-2 rounded-xl text-sm ${selected ? 'bg-emerald-600' : 'bg-gray-800 hover:bg-emerald-600'}`}
                      >
                        {p.name}
                      </button>
                    );
                  })}
                </div>

                {selectedMyProducts.length > 0 && (
                  <div className="mt-3 bg-gray-800 p-3 rounded-xl border border-gray-700">
                    {selectedMyProducts.map((it) => (
                      <div key={it.id} className="flex items-center justify-between py-2">
                        <div>
                          <div className="font-medium">{it.name}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="number" min={1} value={it.qty} onChange={(e) => setMyProductQty(it.id, Number(e.target.value))} className="w-20 px-3 py-1 rounded-lg bg-gray-900 border border-gray-700" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-xl font-semibold">اختر الشركة المقابلة</h2>
                <div className="flex gap-3 items-center mt-2">
                  <select value={selectedCompany} onChange={(e) => selectCompany(e.target.value)} className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700">
                    <option value="">اختر الشركة</option>
                    {Object.keys(companies).map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>

                  {selectedCompany && (
                    <>
                      <div className="flex items-center gap-2 ml-auto">
                        <Search className="w-4 h-4 text-gray-300" />
                        <input placeholder="ابحث داخل منتجات الشركة" value={companySearch} onChange={(e) => setCompanySearch(e.target.value)} className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700" />
                      </div>
                    </>
                  )}
                </div>

                {selectedCompany && (
                  <div className="mt-3 bg-gray-800 p-3 rounded-xl border border-gray-700">
                    <div className="flex gap-2 flex-wrap">
                      {companyAvailableProducts.length === 0 && <div className="text-gray-400">لا توجد منتجات مطابقة</div>}
                      {companyAvailableProducts.map((name) => (
                        <button key={name} onClick={() => addCompanyProduct(name)} className="px-3 py-2 rounded-xl bg-gray-900 hover:bg-emerald-600">{name}</button>
                      ))}
                    </div>

                    {selectedCompanyProducts.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {selectedCompanyProducts.map((it) => (
                          <div key={it.name} className="flex items-center justify-between">
                            <div className="font-medium">{it.name}</div>
                            <div className="flex items-center gap-2">
                              <input type="number" min={1} value={it.qty} onChange={(e) => setCompanyProductQty(it.name, Number(e.target.value))} className="w-20 px-3 py-1 rounded-lg bg-gray-900 border border-gray-700" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => { setSelectedMyProducts([]); setSelectedCompany(''); setSelectedCompanyProducts([]); setCompanySearch(''); }} className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700">إلغاء</button>
                <button onClick={confirmExchange} className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700">تأكيد البدل</button>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* ----- مودال إضافة صنف ----- */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 w-full max-w-md rounded-2xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-emerald-400 mb-3">إضافة صنف جديد</h3>
            <input value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder="اسم الصنف" className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 mb-4" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAddItemModal(false)} className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700">إلغاء</button>
              <button onClick={saveNewItem} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700">حفظ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
