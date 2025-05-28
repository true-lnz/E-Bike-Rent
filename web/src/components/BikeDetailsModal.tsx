import { Divider, Group, Image, Modal, Stack, Text } from "@mantine/core";
import { BASE_IMAGE_URL } from "../constants";
import type { Bike } from "../types/bike";

interface BikeDetailsModalProps {
  bike: Bike;
  opened: boolean;
  onClose: () => void;
}

export default function BikeDetailsModal({ bike, opened, onClose }: BikeDetailsModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Подробнее о "${bike.name}"`}
      centered
      radius="lg"
    >
      <Stack>
        <Image
          src={`${BASE_IMAGE_URL}${bike.image_url}`}
          alt={bike.name}
          h={250}
          fit="contain"
          mx="auto"
        />

        <Text fw={600} size="lg">{bike.name}</Text>

        <Group justify="space-between">
          <Text c="dimmed">Макс. скорость:</Text>
          <Text fw={500}>{bike.max_speed} км/ч</Text>
        </Group>
        <Group justify="space-between">
          <Text c="dimmed">Запас хода:</Text>
          <Text fw={500}>{bike.max_range} км</Text>
        </Group>
        <Group justify="space-between">
          <Text c="dimmed">Мощность:</Text>
          <Text fw={500}>{bike.power} Вт</Text>
        </Group>
        <Group justify="space-between">
          <Text c="dimmed">Батарея:</Text>
          <Text fw={500}>{bike.battery}</Text>
        </Group>
        <Group justify="space-between">
          <Text c="dimmed">Привод:</Text>
          <Text fw={500}>{bike.drive}</Text>
        </Group>
        <Group justify="space-between">
          <Text c="dimmed">Рама:</Text>
          <Text fw={500}>{bike.frame}</Text>
        </Group>
        <Group justify="space-between">
          <Text c="dimmed">Амортизация:</Text>
          <Text fw={500}>{bike.suspension ? "Да" : "Нет"}</Text>
        </Group>
        <Group justify="space-between">
          <Text c="dimmed">Размер колеса:</Text>
          <Text fw={500}>{bike.wheel_size}"</Text>
        </Group>

        <Divider my="xs" />

        <Text size="md" fw={600}>
          Цена за день: {bike.day_price.toLocaleString()} ₽
        </Text>

        <Text size="sm" c="dimmed" mt="xs">
          💬 Можно договориться с менеджером об аренде на 1 или 3 дня, а также на срок больше месяца.
        </Text>
      </Stack>
    </Modal>
  );
}