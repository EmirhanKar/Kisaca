"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import { createContext, useCallback, useContext, useState } from "react";

type ToastType = "success" | "error" | "info";
type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
            className={`fixed bottom-10 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full shadow-md text-sm flex items-center gap-2 z-[9999]
              ${
                toast.type === "success"
                  ? "bg-neutral-900 text-white dark:bg-neutral-800"
                  : toast.type === "error"
                  ? "bg-red-600 text-white"
                  : "bg-blue-600 text-white"
              }`}
          >
            {toast.type === "success" && (
              <CheckCircle2 className="text-green-400" size={18} />
            )}
            {toast.type === "error" && <XCircle className="text-white" size={18} />}
            {toast.type === "info" && <Info className="text-white" size={18} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};
