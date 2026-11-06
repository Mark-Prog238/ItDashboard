import { create } from "zustand";

interface PrimopredajaDialogStore {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    setIsOpen: (isOpen: boolean) => void;
}

export const usePrimopredajaDialog = create<PrimopredajaDialogStore>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    setIsOpen: (isOpen) => set({ isOpen }),
}));