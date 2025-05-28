export type ModalOptions = {
  title?: string;
  content: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  withCancel?: boolean; //sdsdsd
};