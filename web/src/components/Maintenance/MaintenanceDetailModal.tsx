import {
	Avatar,
	Badge,
	Box,
	Card,
	Divider,
	Grid,
	Group,
	Modal,
	Paper,
	Stack,
	Text,
	Timeline
} from "@mantine/core";
import {
	IconCheck,
	IconClock,
	IconHourglass,
	IconPackage,
	IconTools,
	IconX
} from "@tabler/icons-react";
import dayjs from "dayjs";
import type { Maintenance } from "../../types/maintenance";

type StatusConfig = {
  [key: string]: {
    icon: React.ReactNode;
    color: string;
  };
};

const STATUS_CONFIG: StatusConfig = {
  "заявка в обработке": { icon: <IconHourglass size={16} />, color: "blue" },
  "отказано": { icon: <IconX size={16} />, color: "red" },
  "ремонтируется": { icon: <IconTools size={16} />, color: "orange" },
  "готов к выдаче": { icon: <IconPackage size={16} />, color: "violet" },
  "завершен": { icon: <IconCheck size={16} />, color: "teal" }
} as const;

type Props = {
  opened: boolean;
  onClose: () => void;
  maintenance: Maintenance | null;
};

export function MaintenanceDetailModal({ opened, onClose, maintenance }: Props) {
  if (!maintenance) return null;

  const statusData = maintenance.status in STATUS_CONFIG
    ? STATUS_CONFIG[maintenance.status]
    : { icon: <IconClock size={16} />, color: "gray" };

  const isRejected = maintenance.status === "отказано";

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Заявка #${maintenance.id}`}
      centered
      size="lg"
      radius="lg"
    >
      <Paper withBorder p="md" radius="md">
        <Grid gutter="xl">
          {/* Таймлайн сбоку */}
          <Grid.Col span={4}>
            <Timeline 
              active={getStatusIndex(maintenance.status)} 
              bulletSize={28}
              lineWidth={2}
              color={isRejected ? "red" : "blue"}
            >
              <Timeline.Item 
                title="Создана" 
                bullet={<IconClock size={16} />}
              >
                <Text size="xs" c="dimmed">
                  {dayjs(maintenance.created_at).format('DD.MM.YYYY')}
                </Text>
              </Timeline.Item>

              {!isRejected && (
                <>
                  <Timeline.Item 
                    title="В работе" 
                    bullet={<IconTools size={16} />}
                  >
                    {maintenance.start_date && (
                      <Text size="xs" c="dimmed">
                        {dayjs(maintenance.start_date).format('DD.MM.YYYY')}
                      </Text>
                    )}
                  </Timeline.Item>

                  <Timeline.Item 
                    title="Завершение" 
                    bullet={<IconCheck size={16} />}
                  >
                    {maintenance.finish_date ? (
                      <Text size="xs" c="dimmed">
                        {dayjs(maintenance.finish_date).format('DD.MM.YYYY')}
                      </Text>
                    ) : (
                      <Text size="xs" c="dimmed">
                        {maintenance.status === "готов к выдаче" 
                          ? "Ожидает получения" 
                          : "—"}
                      </Text>
                    )}
                  </Timeline.Item>
                </>
              )}

              {isRejected && (
                <Timeline.Item 
                  title="Отказано" 
                  bullet={<IconX size={16} />}
                >
                  <Text size="xs" c="dimmed">
                    {dayjs(maintenance.start_date || maintenance.created_at).format('DD.MM.YYYY')}
                  </Text>
                </Timeline.Item>
              )}
            </Timeline>
          </Grid.Col>

          {/* Основная информация */}
          <Grid.Col span={8}>
            <Stack gap="md">
              {/* Шапка с статусом */}
              <Group gap="sm">
                <Avatar color={statusData.color} radius="xl">
                  {statusData.icon}
                </Avatar>
                <div>
                  <Text fw={600} size="lg">{maintenance.bicycle_name}</Text>
                  <Badge 
                    color={statusData.color} 
                    variant="light"
                    size="lg"
                  >
                    {maintenance.status}
                  </Badge>
                </div>
              </Group>

              <Divider />

              {/* Детали заявки */}
              <Box>
                <Text fw={500} mb="xs">Описание проблемы</Text>
                <Card withBorder p="sm" radius="sm">
                  <Text>{maintenance.details || "—"}</Text>
                </Card>
              </Box>

              {maintenance.admin_message && (
                <Box>
                  <Text fw={500} mb="xs">Комментарий администратора</Text>
                  <Card 
                    withBorder 
                    p="sm" 
                    radius="sm" 
                    bg={isRejected ? "var(--mantine-color-red-light)" : undefined}
                  >
                    <Text c={isRejected ? "red" : undefined}>
                      {maintenance.admin_message}
                    </Text>
                  </Card>
                </Box>
              )}

              {/* Дополнительная информация */}
              <Group grow>
                <Card withBorder p="sm" radius="sm">
                  <Text size="sm" c="dimmed">Стоимость</Text>
                  <Text fw={500}>
                    {maintenance.price ? `${maintenance.price.toLocaleString()} ₽` : "—"}
                  </Text>
                </Card>

                <Card withBorder p="sm" radius="sm">
                  <Text size="sm" c="dimmed">Дата начала</Text>
                  <Text fw={500}>
                    {maintenance.start_date
                      ? dayjs(maintenance.start_date).format('DD.MM.YYYY')
                      : "—"}
                  </Text>
                </Card>
              </Group>
            </Stack>
          </Grid.Col>
        </Grid>
      </Paper>
    </Modal>
  );
}

function getStatusIndex(status: string): number {
  const order = [
    "заявка в обработке",
    "ремонтируется",
    "готов к выдаче",
    "завершен"
  ];
  return Math.max(0, order.indexOf(status));
}