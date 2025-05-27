import { createContext, useContext, useState } from "react";
import type { ModalOptions } from "../types/modalOptions";
import { ModalContainer } from "../components/ModalContainers";

type ModalContextType = {
  openModal: (options: ModalOptions) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
};

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalOptions, setModalOptions] = useState<ModalOptions | null>(null);

  const openModal = (options: ModalOptions) => {
    setModalOptions(options);
  };

  const closeModal = () => {
    setModalOptions(null);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <ModalContainer options={modalOptions} onClose={closeModal} />
    </ModalContext.Provider>
  );
};
