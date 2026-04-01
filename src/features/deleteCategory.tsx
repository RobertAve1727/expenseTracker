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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all">
      {/* MODAL BODY: Lighter grey glassmorphism matching Initialize Segment screenshot */}
      <div className="bg-[#b3b3b3]/90 border border-white/20 w-full max-w-md rounded-[3.5rem] overflow-hidden shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-200 p-10 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-8 top-8 p-2 rounded-xl text-slate-500 hover:text-black transition-all"
        >
          <X size={24} strokeWidth={3} />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Warning Icon Container: High contrast Rose theme */}
          <div className="w-24 h-24 bg-rose-500/10 text-rose-500 rounded-[2rem] flex items-center justify-center mb-8 border-2 border-rose-500/20 shadow-lg shadow-rose-500/10">
            <AlertTriangle size={40} strokeWidth={3} />
          </div>

          {/* Typography: Bold, high-contrast, and tracking-tighter */}
          <h3 className="text-3xl font-black text-[#1a1a1a] tracking-tighter leading-none mb-4">
            Delete Category?
          </h3>

          <div className="mb-10">
            <p className="text-[12px] font-black uppercase text-slate-500 tracking-[0.2em] leading-loose px-4">
              Permanent removal of{" "}
              <span className="text-[#1a1a1a]">
                "{categoryName.toUpperCase()}"
              </span>
              . Linked transactions will require re-categorization within the
              stream.
            </p>
          </div>
        </div>

        {/* Action Buttons: Matching the wide, rounded style of Initialize Segment */}
        <div className="flex flex-col gap-4">
          <button
            type="button"
            disabled={isLoading}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black py-6 rounded-[1.5rem] transition-all active:scale-[0.98] shadow-xl shadow-rose-500/20 disabled:opacity-30 uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2"
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
                Syncing Deletion...
              </>
            ) : (
              <>
                <Trash2 size={16} strokeWidth={3} />
                Remove Category
              </>
            )}
          </button>

          <button
            type="button"
            className="w-full py-6 bg-white/50 hover:bg-white/80 text-[#1a1a1a] border border-white/40 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95"
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
