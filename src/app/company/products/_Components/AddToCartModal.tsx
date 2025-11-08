import { FiMinus, FiPlus } from "react-icons/fi";
import { AddToCartModalProps } from "../_types/product.types";

export default function AddToCartModal({
  isOpen,
  onClose,
  product,
  quantity,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onAddToCart,
  isLoading = false,
}: AddToCartModalProps) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl border border-gray-200 max-w-md w-full shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                إضافة إلى السلة
              </h2>
              <p className="text-gray-600 mt-1">{product.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors text-xl p-2"
            >
              ✕
            </button>
          </div>

          {/* Product Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600">السعر:</span>
              <span className="text-emerald-600 font-bold">
                {product.price.toFixed(2)} ج.م
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">المخزون المتاح:</span>
              <span className="text-gray-900 font-medium">
                {product.quantity} وحدة
              </span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-gray-600 text-sm mb-3">الكمية:</label>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={onDecreaseQuantity}
                disabled={quantity <= 1}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 rounded-full flex items-center justify-center transition-colors border border-gray-300"
              >
                <FiMinus className="w-4 h-4 text-gray-600" />
              </button>

              <span className="text-2xl font-bold text-gray-900 w-12 text-center">
                {quantity}
              </span>

              <button
                onClick={onIncreaseQuantity}
                disabled={quantity >= product.quantity}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 rounded-full flex items-center justify-center transition-colors border border-gray-300"
              >
                <FiPlus className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Total Price */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">الإجمالي:</span>
              <span className="text-2xl font-bold text-emerald-600">
                {(product.price * quantity).toFixed(2)} ج.م
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-colors disabled:opacity-50"
            >
              إلغاء
            </button>
            <button
              onClick={onAddToCart}
              disabled={isLoading}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl font-semibold transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري الإضافة...
                </>
              ) : (
                "إضافة"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
