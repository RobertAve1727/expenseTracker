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
    // FIX: Match New Bucket/Record overlay z-index and blur
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm transition-all text-left">
      {/* MODAL BODY: Reduced overall padding (p-10 -> p-8) to decrease size */}
      <div className="bg-[#b3b3b3]/95 border border-white/20 w-full max-w-md rounded-[3.5rem] p-8 shadow-2xl backdrop-blur-3xl animate-in zoom-in-95 duration-200 relative">
        {/* Close Button: Moved in slightly to match reduced padding */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 p-2 rounded-xl text-slate-500 hover:text-black hover:bg-black/5 transition-all"
        >
          <X size={20} strokeWidth={3} />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Warning Icon Container: High contrast Rose theme */}
          <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mb-6 border-2 border-rose-500/20 shadow-lg shadow-rose-500/10">
            <AlertTriangle size={36} strokeWidth={3} />
          </div>

          {/* Typography: Bold, high-contrast, and tracking-tighter */}
          <h3 className="text-3xl font-black text-[#1a1a1a] tracking-tighter leading-none mb-3">
            Remove Category?
          </h3>

          {/* FIX: Reduced body vertical margin (mb-10 -> mb-8) */}
          <div className="mb-8">
            <p className="text-[11px] font-black uppercase text-slate-600 tracking-[0.2em] leading-loose px-4">
              Permanent removal of{" "}
              <span className="text-[#1a1a1a] underline decoration-rose-500/20 underline-offset-2">
                "{categoryName.toUpperCase()}"
              </span>
              . Connected transaction entries will require re-segmenting.
            </p>
          </div>
        </div>

        {/* Action Buttons: FIX - Swapped stacked buttons for a compact row */}
        <div className="flex flex-row gap-3">
          {/* Main Action (Remove) */}
          <button
            type="button"
            disabled={isLoading}
            className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-black py-4 rounded-xl transition-all active:scale-[0.98] shadow-xl shadow-rose-500/20 disabled:opacity-30 uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2"
            onClick={onConfirm}
          >
            {isLoading ? (
              <>
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
                Syncing...
              </>
            ) : (
              <>
                <Trash2 size={16} strokeWidth={3} />
                Remove Category
              </>
            )}
          </button>

          {/* Secondary Action (Cancel/Abort) */}
          <button
            type="button"
            className="flex-1 py-4 bg-white/50 hover:bg-white/80 text-[#1a1a1a] border border-white/40 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategoryModal;
