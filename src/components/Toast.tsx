import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-3 bg-[#141414] border border-[#FF5C00]/40 text-white px-4 py-3 rounded-lg shadow-2xl backdrop-blur-md">
        <div className="w-2 h-2 rounded-full bg-[#FF5C00] animate-ping" />
        <CheckCircle2 className="w-4 h-4 text-[#FF5C00]" />
        <p className="text-sm font-mono-code text-white/90">{message}</p>
        <button
          onClick={onClose}
          className="ml-2 text-white/40 hover:text-white transition-colors p-1"
          aria-label="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
