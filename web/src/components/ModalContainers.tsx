import { Button, Group, Modal, Stack } from "@mantine/core";
import type { ModalOptions } from "../types/modalOptions";

type Props = {
  options: ModalOptions | null;
  onClose: () => void;
};

export const ModalContainer = ({ options, onClose }: Props) => {
  return (
    <Modal
      opened={!!options}
      onClose={onClose}
      title={options?.title || "Информация"}
      centered
    >
      {options?.content && <Stack>{options.content}</Stack>}

      <Group justify="flex-end" mt="md">
        {options?.withCancel && (
          <Button variant="default" onClick={() => {
            options.onCancel?.();
            onClose();
          }}>
            {options.cancelText || "Отмена"}
          </Button>
        )}

        {options?.onConfirm && (
          <Button
            onClick={() => {
              options.onConfirm?.();
              onClose();
            }}
          >
            {options.confirmText || "ОК"}
          </Button>
        )}
      </Group>
    </Modal>
  );
};