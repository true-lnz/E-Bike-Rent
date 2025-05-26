import { Button, Card, Flex, Stack, Text } from "@mantine/core";

export function MaintenanceCard({
  title,
  description,
  onApplyClick,
}: {
  title: string;
  description: string;
  onApplyClick: () => void;
}) {
  return (
    <Card
      shadow="md"
      padding="lg"
      radius="xl"
      withBorder
      h="100%"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <Flex justify="space-between" align="flex-start" mb="md" style={{ flexGrow: 1 }}>
        <Stack gap="xs" w="80%">
          <Text size="lg" fw={600}>
            {title}
          </Text>
          <Text c="dimmed" size="sm">
            {description}
          </Text>
        </Stack>

        {/* <IconWrench size={32} color="#228be6" /> */}
      </Flex>

      <Button
        mt="auto"
        onClick={onApplyClick}
        color="gray.2"
        c="dark"
        radius="xl"
        // leftSection={<IconPlus size={18} />}
      >
        Оставить заявку
      </Button>
    </Card>
  );
}
