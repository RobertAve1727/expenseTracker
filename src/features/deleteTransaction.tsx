import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Record?",
  message = "This action is permanent and will remove this data point from your financial stream.",
}) => {
  if (!isOpen) return null;

  return (
    // FIX: Theme variable backdrop and blur
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all text-center">
      {/* MODAL BODY: Theme variable background and blur (like in image_1.png) */}
      <div className="bg-[var(--surface)] border border-[var(--border)] w-full max-w-sm rounded-[3rem] p-10 shadow-2xl Backdrop-blur-xl animate-in zoom-in-95 duration-200 relative">
        {/* Header Close Button */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 p-2 text-[var(--text)] opacity-50 hover:opacity-100 hover:bg-white/5 transition-all"
        >
          <X size={24} />
        </button>

        {/* Warning Icon Container */}
        <div className="w-24 h-24 bg-rose-500/10 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border-2 border-rose-500/20 shadow-lg shadow-rose-500/10">
          <AlertTriangle size={40} strokeWidth={3} />
        </div>

        {/* Text Content */}
        <div className="space-y-4 mb-10">
          {/* FIX: Pure white text-[var(--text-h)] 2xl heading */}
          <h2 className="text-2xl font-black text-[var(--text-h)] tracking-tighter">
            {title}
          </h2>

          {/* FIX: Fixed descriptions fromSlate-200 back to text-[var(--text)] 
              with correct opacity and visibility from image_1.png */}
          <p className="text-[var(--text)] text-[12px] font-black uppercase tracking-[0.2em] leading-loose px-2 opacity-50">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <button
            onClick={onConfirm}
            className="w-full py-5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-rose-500/30 active:scale-95"
          >
            Confirm Delete
          </button>

          {/* MATCHED: Secondary button uses the glass input style bg (bg-black/20) and border */}
          <button
            onClick={onClose}
            className="w-full py-5 bg-black/20 hover:bg-white/5 text-[var(--text-h)] border border-[var(--border)] rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 backdrop-blur-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
