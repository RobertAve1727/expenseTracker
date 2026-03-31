import React, { useEffect } from "react";
import { AlertTriangle, X, Trash2 } from "lucide-react";

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  categoryName: string;
  isLoading?: boolean;
}

const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  categoryName,
  isLoading = false,
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with Blur */}
      <div
        className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-[28px] bg-white dark:bg-[#1a1d23] p-6 text-left align-middle shadow-2xl transition-all border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center mt-2">
          {/* Warning Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-500/10 mb-6">
            <AlertTriangle className="h-8 w-8 text-rose-500" />
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-6">
            Delete Category?
          </h3>

          <div className="mt-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed px-2">
              Are you sure you want to delete{" "}
              <span className="font-bold text-slate-900 dark:text-slate-200">
                "{categoryName}"
              </span>
              ? This will permanently remove the category. Any transactions
              currently linked to it will need to be re-categorized.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            className="flex-1 inline-flex justify-center items-center px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all outline-none"
            onClick={onClose}
          >
            Keep Category
          </button>

          <button
            type="button"
            disabled={isLoading}
            className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-3 text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl shadow-lg shadow-rose-500/20 active:scale-[0.98] transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onConfirm}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Deleting...
              </span>
            ) : (
              <>
                <Trash2 size={16} />
                Delete Category
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategoryModal;
