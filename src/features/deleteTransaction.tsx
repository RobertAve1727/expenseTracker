import React from "react";
import { AlertTriangle } from "lucide-react";

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
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-all">
      <div className="bg-[var(--surface)] border border-[var(--border)] w-full max-w-sm rounded-[3rem] p-10 shadow-2xl text-center backdrop-blur-xl animate-in zoom-in-95 duration-200">
        {/* Warning Icon Container */}
        <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-rose-500/20">
          <AlertTriangle size={36} strokeWidth={2.5} />
        </div>

        {/* Text Content */}
        <h2 className="text-2xl font-black text-[var(--text-h)] mb-3 tracking-tighter">
          {title}
        </h2>
        <p className="text-[var(--text)] mb-10 leading-relaxed text-xs font-bold uppercase tracking-widest opacity-60">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <button
            onClick={onConfirm}
            className="w-full py-5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-rose-500/20 active:scale-95"
          >
            Confirm Delete
          </button>
          <button
            onClick={onClose}
            className="w-full py-5 bg-white/5 hover:bg-white/10 text-[var(--text-h)] border border-[var(--border)] rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
