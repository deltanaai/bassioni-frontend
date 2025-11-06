"use client";

interface QuantityCounterProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
}

export default function QuantityCounter({ 
  quantity, 
  onQuantityChange, 
  min = 1, 
  max = 1000 
}: QuantityCounterProps) {
  const increment = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  const decrement = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= min && value <= max) {
      onQuantityChange(value);
    } else if (e.target.value === '') {
      onQuantityChange(min);
    }
  };

  return (
    <div className="flex items-center justify-between bg-gray-700 rounded-lg p-2 border border-gray-600">
      {/* زر الناقص */}
      <button
        onClick={decrement}
        disabled={quantity <= min}
        className="w-8 h-8 flex items-center justify-center bg-gray-600 hover:bg-gray-500 disabled:bg-gray-800 disabled:cursor-not-allowed rounded-md text-white transition-colors"
      >
        -
      </button>

      {/* حقل الإدخال */}
      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        min={min}
        max={max}
        className="w-16 text-center bg-transparent border-none text-white focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />

      {/* زر الزيادة */}
      <button
        onClick={increment}
        disabled={quantity >= max}
        className="w-8 h-8 flex items-center justify-center bg-gray-600 hover:bg-gray-500 disabled:bg-gray-800 disabled:cursor-not-allowed rounded-md text-white transition-colors"
      >
        +
      </button>
    </div>
  );
}