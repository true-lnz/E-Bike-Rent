import { Button, Card, Grid, rem, Stack, Text } from "@mantine/core";
import { IconBike, IconPlus } from "@tabler/icons-react";
import type { ReactNode } from "react";

export function MaintenanceCard({
  title,
  description,
  onApplyClick,
  icon = <IconBike size={120} color="black" />,
  background = "#fda65b",
  textColor = "white"
}: {
  title: string;
  description: string;
  onApplyClick: () => void;
  icon?: ReactNode;
  background?: string;
  textColor?: string;
}) {
  return (
    <Card
      shadow="md"
      padding="xl"
      radius="xl"
      bg={background}
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Text fz={rem(24)} fw={700} c={textColor} mb="md">
        {title}
      </Text>

      <Grid grow mt="auto" align="end">
        <Grid.Col span={8}>
          <Stack gap="sm">
            <Text c={textColor} size="md">
              {description}
            </Text>
            <Button
              onClick={onApplyClick}
              variant="white"
              color="dark"
              radius="xl"
							size="md"
              leftSection={<IconPlus size={18} />}
              w="fit-content"
            >
              Оставить заявку
            </Button>
          </Stack>
        </Grid.Col>

        <Grid.Col span={4} style={{ textAlign: "right" }}>
          {icon}
        </Grid.Col>
      </Grid>
    </Card>
  );
}
