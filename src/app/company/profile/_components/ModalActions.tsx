interface ModalActionsProps {
  onCancel: () => void;
  isLoading?: boolean;
  submitText?: string;
  cancelText?: string;
}

export default function ModalActions({
  onCancel,
  isLoading = false,
  submitText = "حفظ التغييرات",
  cancelText = "إلغاء",
}: ModalActionsProps) {
  return (
    <div className="mt-6 flex gap-3">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
      >
        {cancelText}
      </button>
      <button
        type="submit"
        disabled={isLoading}
        className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
      >
        {isLoading ? "جاري الحفظ..." : submitText}
      </button>
    </div>
  );
}
