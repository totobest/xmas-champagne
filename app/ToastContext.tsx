import type { Toast } from "primereact/toast";
import { createContext, useContext } from "react";


export const ToastContext = createContext<Toast | null>(null);

export function useToastContext() {
    const toastContext = useContext(ToastContext);
    if (!toastContext) {
        throw new Error("Try to use useToastContext without a ToastProvider");
    }
    return toastContext;
}