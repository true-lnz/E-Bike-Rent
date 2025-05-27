import { Badge, Modal, Stack, Text } from "@mantine/core";
import dayjs from "dayjs";
import type { Maintenance } from "../../types/maintenance";

type Props = {
  opened: boolean;
  onClose: () => void;
  maintenance: Maintenance | null;
};

export function MaintenanceDetailModal({ opened, onClose, maintenance }: Props) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Детали заявки"
      centered
      size="lg"
      radius="lg"
    >
      <Stack>
        <Text><strong>Название велосипеда:</strong></Text>
        <Text>{maintenance?.bicycle_name || "—"}</Text>

        <Text><strong>Дата создания:</strong></Text>
        <Text>
          {maintenance?.created_at
            ? dayjs(maintenance.created_at).format("DD.MM.YYYY")
            : "—"}
        </Text>

        <Text><strong>Описание:</strong></Text>
        <Text>{maintenance?.details?.trim() || "Описание отсутствует"}</Text>

        <Text><strong>Примерная сумма:</strong></Text>
        <Text>
          {maintenance?.price !== null && maintenance?.price !== undefined
            ? `${maintenance.price} ₽`
            : "Не указано"}
        </Text>

        <Text><strong>Примерное время:</strong></Text>
        <Text>
          {maintenance?.estimated_time
            ? dayjs(maintenance.estimated_time).format("DD.MM.YYYY")
            : "Не указано"}
        </Text>

        <Text><strong>Статус:</strong></Text>
        <Badge>
          {maintenance?.status || "Статус неизвестен"}
        </Badge>
      </Stack>
    </Modal>
  );
}
