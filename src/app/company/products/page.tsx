'use client'
// import { productFormSchema } from '@/schemas/AddProduts'
import { ProductFormData } from '@/types'
import { useState } from 'react'
import { FiSearch, FiPlus, FiEdit, FiTrash2, FiImage, FiFilter } from 'react-icons/fi'

interface Product {
  id: number
  name: string
  customerName: string
  category: string
  brand: string
  dosage: string
  concentration: string
  quantity: number
  price: number
  images: string[]
  warehouse: string
}

const sampleProducts: Product[] = [
  {
    id: 1,
    name: 'بانادول اكسترا',
    customerName: 'أحمد محمد',
    category: 'مسكنات',
    brand: 'جلاكسو سميث كلاين',
    dosage: 'أقراص',
    concentration: '500 مجم',
    quantity: 120,
    price: 15,
    images: ['panadol1.jpg', 'panadol2.jpg'],
    warehouse: 'مخزن القاهرة'
  },
  {
    id: 2,
    name: 'فيتامين سي 1000 مجم',
    customerName: 'سارة علي',
    category: 'فيتامينات',
    brand: 'ناتورال',
    dosage: 'أقراص فوارة',
    concentration: '1000 مجم',
    quantity: 85,
    price: 30,
    images: ['vitamin-c.jpg'],
    warehouse: 'مخزن الإسكندرية'
  }
]

const categories = ['مسكنات', 'فيتامينات', 'مضادات حيوية', 'أدوية سكري', 'مستحضرات جلدية']
const brands = ['جلاكسو سميث كلاين', 'نوفارتس', 'فايزر', 'سانوفي', 'ناتورال']
const dosages = ['أقراص', 'شراب', 'حقن', 'كريم', 'مرهم', 'أقراص فوارة']
const warehouses = ['مخزن القاهرة', 'مخزن الإسكندرية', 'مخزن أسيوط']

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(sampleProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterBrand, setFilterBrand] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    customerName: '',
    category: '',
    brand: '',
    dosage: '',
    concentration: '',
    quantity: 0,
    price: 0,
    images: [] as string[],
    warehouse: ''
  })

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setFormErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).map(file => URL.createObjectURL(file))
      setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }))
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = productFormSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ProductFormData, string>> = {}
      for (const issue of result.error.issues) {
        const path = issue.path[0] as keyof ProductFormData
        if (path) fieldErrors[path] = issue.message
      }
      setFormErrors(fieldErrors)
      return
    }
    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id ? { ...result.data, id: editingProduct.id } as Product : p
      ))
    } else {
      const newProduct: Product = {
        ...result.data,
        id: Math.max(...products.map(p => p.id), 0) + 1
      } as Product
      setProducts([...products, newProduct])
    }
    setShowAddModal(false)
    setEditingProduct(null)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      customerName: '',
      category: '',
      brand: '',
      dosage: '',
      concentration: '',
      quantity: 0,
      price: 0,
      images: [],
      warehouse: ''
    })
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      customerName: product.customerName,
      category: product.category,
      brand: product.brand,
      dosage: product.dosage,
      concentration: product.concentration,
      quantity: product.quantity,
      price: product.price,
      images: product.images,
      warehouse: product.warehouse
    })
    setShowAddModal(true)
  }

  const handleDelete = (id: number) => {
    setProducts(products.filter(product => product.id !== id))
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.includes(searchTerm) || product.customerName.includes(searchTerm)
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory
    const matchesBrand = filterBrand === 'all' || product.brand === filterBrand
    return matchesSearch && matchesCategory && matchesBrand
  })

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-800">إدارة المنتجات</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 min-w-[250px]">
            <FiSearch className="absolute right-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث باسم المنتج أو العميل..."
              className="w-full pr-10 pl-4 py-2 border rounded-lg bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow"
          >
            <FiPlus /> إضافة منتج
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div className="flex items-center gap-2 text-gray-600">
          <FiFilter /> <span>تصفية:</span>
        </div>
        <select
          className="px-3 py-2 border rounded-lg bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">جميع الفئات</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <select
          className="px-3 py-2 border rounded-lg bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterBrand}
          onChange={(e) => setFilterBrand(e.target.value)}
        >
          <option value="all">جميع البراندات</option>
          {brands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {['#','اسم المنتج','اسم العميل','الفئة','البراند','الجرعة','التركيز','الكمية','السعر','المخزن','الصور','إجراءات'].map(h => (
                <th key={h} className="px-4 py-3 text-right text-sm font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={12} className="text-center py-6 text-gray-500">لا توجد منتجات متطابقة مع بحثك</td>
              </tr>
            ) : (
              filteredProducts.map((product, i) => (
                <tr key={product.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3 text-gray-600">{product.customerName}</td>
                  <td className="px-4 py-3 text-gray-600">{product.category}</td>
                  <td className="px-4 py-3 text-gray-600">{product.brand}</td>
                  <td className="px-4 py-3 text-gray-600">{product.dosage}</td>
                  <td className="px-4 py-3 text-gray-600">{product.concentration}</td>
                  <td className="px-4 py-3 text-gray-600">{product.quantity}</td>
                  <td className="px-4 py-3 text-gray-600">{product.price} ر.س</td>
                  <td className="px-4 py-3 text-gray-600">{product.warehouse}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {product.images.slice(0, 3).map((_, i) => (
                        <div key={i} className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                          <FiImage className="text-gray-500" />
                        </div>
                      ))}
                      {product.images.length > 3 && (
                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                          +{product.images.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-700 p-1" title="تعديل"><FiEdit /></button>
                      <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-600 p-1" title="حذف"><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
              </h2>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <input type="text" name="name" placeholder="اسم المنتج" value={formData.name} onChange={handleInputChange} className="p-2 rounded bg-white border border-gray-300 text-gray-900"/>
                  {formErrors.name && <span className="text-red-600 text-sm">{formErrors.name}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <input type="text" name="customerName" placeholder="اسم العميل" value={formData.customerName} onChange={handleInputChange} className="p-2 rounded bg-white border border-gray-300 text-gray-900"/>
                  {formErrors.customerName && <span className="text-red-600 text-sm">{formErrors.customerName}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <select name="category" value={formData.category} onChange={handleInputChange} className="p-2 rounded bg-white border border-gray-300 text-gray-900">
                    <option value="">اختر الفئة</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {formErrors.category && <span className="text-red-600 text-sm">{formErrors.category}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <select name="brand" value={formData.brand} onChange={handleInputChange} className="p-2 rounded bg-white border border-gray-300 text-gray-900">
                    <option value="">اختر البراند</option>
                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  {formErrors.brand && <span className="text-red-600 text-sm">{formErrors.brand}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <select name="dosage" value={formData.dosage} onChange={handleInputChange} className="p-2 rounded bg-white border border-gray-300 text-gray-900">
                    <option value="">اختر الجرعة</option>
                    {dosages.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {formErrors.dosage && <span className="text-red-600 text-sm">{formErrors.dosage}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <input type="text" name="concentration" placeholder="التركيز" value={formData.concentration} onChange={handleInputChange} className="p-2 rounded bg-white border border-gray-300 text-gray-900"/>
                  {formErrors.concentration && <span className="text-red-600 text-sm">{formErrors.concentration}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <input type="number" name="quantity" placeholder="الكمية" value={formData.quantity} onChange={handleInputChange} className="p-2 rounded bg-white border border-gray-300 text-gray-900"/>
                  {formErrors.quantity && <span className="text-red-600 text-sm">{formErrors.quantity}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <input type="number" name="price" placeholder="السعر" value={formData.price} onChange={handleInputChange} className="p-2 rounded bg-white border border-gray-300 text-gray-900"/>
                  {formErrors.price && <span className="text-red-600 text-sm">{formErrors.price}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <select name="warehouse" value={formData.warehouse} onChange={handleInputChange} className="p-2 rounded bg-white border border-gray-300 text-gray-900">
                    <option value="">اختر المخزن</option>
                    {warehouses.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                  {formErrors.warehouse && <span className="text-red-600 text-sm">{formErrors.warehouse}</span>}
                </div>
                <div className="col-span-2">
                  <label className="block mb-1 text-gray-700">رفع صور</label>
                  <input type="file" multiple onChange={handleImageUpload} className="p-2 bg-white border border-gray-300 rounded text-gray-900 w-full"/>
                  <div className="flex mt-2 gap-2 flex-wrap">
                    {formData.images.map((img, i) => (
                      <div key={i} className="relative w-16 h-16 bg-gray-200 rounded overflow-hidden">
                        <img src={img} alt="" className="w-full h-full object-cover"/>
                        <button type="button" onClick={() => removeImage(i)} className="absolute top-0 right-0 bg-red-500 rounded-full w-5 h-5 text-xs text-white">x</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-span-2 flex justify-end gap-2 mt-4">
                  <button type="button" onClick={() => { setShowAddModal(false); setEditingProduct(null); resetForm(); }} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">إلغاء</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
