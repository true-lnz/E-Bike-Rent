import { Flex, Progress, Text } from "@mantine/core";

interface AdminBikeAvailabilityProps {
  rented: number;
  available: number;
  total: number;
}

export const AdminBikeAvailability = ({ rented, available, total }: AdminBikeAvailabilityProps) => {
  const rentedPercent = (rented / total) * 100;
  const availablePercent = (available / total) * 100;

  return (
    <Flex align="center" gap="sm">
      <Progress.Root size={20} style={{ flex: 1, borderRadius: 999 }}>
        <Progress.Section value={rentedPercent} color="orange.5">
          <Text size="xs" fw={500} c="white" px={8}>
            В аренде: {rented}
          </Text>
        </Progress.Section>
        <Progress.Section value={availablePercent} color="gray.3">
          <Text size="xs" fw={500} c="black" px={8}>
            Свободны: {available}
          </Text>
        </Progress.Section>
				<Progress.Section value={20} color="gray.5">
          <Text size="xs" fw={500} c="black" px={8}>
            Всего: {total}
          </Text>
        </Progress.Section>
      </Progress.Root>
    </Flex>
  );
};