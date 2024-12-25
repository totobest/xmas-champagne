import { Toast } from "primereact/toast";
import { useRef, type ReactNode } from "react";
import { ToastContext } from "./ToastContext";

export default function ToastProvider({ children }: { children: ReactNode }) {
  const toast = useRef<Toast>(null);
  return (
    <>
      <Toast ref={toast} position="center"/>
      {toast.current && (
        <ToastContext.Provider value={toast.current}>
          {children}
        </ToastContext.Provider>
      )}
    </>
  );
}
