import {
	Avatar,
	Badge,
	Box,
	Button,
	Card,
	Divider,
	Grid,
	Group,
	Modal,
	Paper,
	Stack,
	Text,
	Timeline,
} from "@mantine/core";
import {
	IconCheck,
	IconClock,
	IconHourglass,
	IconPackage,
	IconTools,
	IconX,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import type { Maintenance } from "../../types/maintenance";

type Props = {
	opened: boolean;
	onClose: () => void;
	maintenance: Maintenance | null;
};

const STATUS_CONFIG = {
	"заявка в обработке": { icon: <IconHourglass />, color: "blue" },
	"отказано": { icon: <IconX />, color: "red" },
	"ремонтируется": { icon: <IconTools />, color: "orange" },
	"готов к выдаче": { icon: <IconPackage />, color: "violet" },
	"завершен": { icon: <IconCheck />, color: "teal" },
} as const;

const TIMELINE_ORDER = [
	"заявка в обработке",
	"ремонтируется",
	"готов к выдаче",
	"завершен",
];

function getStatusIndex(status: string): number {
	return Math.max(0, TIMELINE_ORDER.indexOf(status));
}

function formatDate(date?: string | null): string {
	return date && date !== "0001-01-01T00:00:00Z"
		? dayjs(date).format("DD.MM.YYYY")
		: "—";
}

export function MaintenanceDetailModal({
	opened,
	onClose,
	maintenance,
}: Props) {
	if (!maintenance) return null;

	const isRejected = maintenance.status === "отказано";
	const statusData =
		STATUS_CONFIG[maintenance.status as keyof typeof STATUS_CONFIG] || {
			icon: <IconClock size={24} />,
			color: "gray",
		};

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title={`Заявка id: ${maintenance.id}`}
			centered
			size="xl"
			radius="lg"
		>
			<Paper withBorder p="md" radius="md">
				<Grid gutter="xl">
					{/* Таймлайн */}
					<Grid.Col span={4}>
						{!isRejected ? (
							<Timeline
								active={getStatusIndex(maintenance.status)}
								bulletSize={36}
								lineWidth={2}
								color="blue"
							>
								<Timeline.Item
									title="Заявка создана"
									bullet={<IconClock size={20} />}
								>
									<Text size="xs" c="dimmed">
										{formatDate(maintenance.created_at)}
									</Text>
								</Timeline.Item>

								<Timeline.Item
									title="В работе"
									bullet={<IconTools size={20} />}
								>
									<Text size="xs" c="dimmed">
										{formatDate(maintenance.start_date)}
									</Text>
								</Timeline.Item>

								<Timeline.Item
									title="Готов к выдаче"
									bullet={<IconPackage size={20} />}
								>
									<Text size="xs" c="dimmed">
										{maintenance.status === "готов к выдаче" || maintenance.status === "завершен"
											? formatDate(maintenance.finish_date)
											: "—"}
									</Text>
								</Timeline.Item>

								<Timeline.Item
									title="Завершен"
									bullet={<IconCheck size={20} />}
								>
									<Text size="xs" c="dimmed">
										{maintenance.status === "завершен"
											? formatDate(maintenance.finish_date)
											: "—"}
									</Text>
								</Timeline.Item>
							</Timeline>
						) : (
							<Timeline active={1} bulletSize={28} lineWidth={2} color="red">
								<Timeline.Item
									title="Заявка создана"
									bullet={<IconClock size={20} />}
								>
									<Text size="xs" c="dimmed">
										{formatDate(maintenance.created_at)}
									</Text>
								</Timeline.Item>
								<Timeline.Item title="Отказано" bullet={<IconX size={20} />}>
									<Text size="xs" c="dimmed">
										{formatDate(maintenance.start_date || maintenance.created_at)}
									</Text>
								</Timeline.Item>
							</Timeline>
						)}
					</Grid.Col>

					{/* Основная информация */}
					<Grid.Col span={8}>
						<Stack gap="md">
							<Group gap="xs">
								<Avatar color={statusData.color} radius="xl" size="lg">
									{statusData.icon}
								</Avatar>
								<Stack gap={0}>
									<Text fw={600} size="lg">{maintenance.bicycle_name}</Text>
									<Badge color={statusData.color} variant="light" size="md">
										{maintenance.status}
									</Badge>
								</Stack>
							</Group>

							<Divider />

							<Box>
								<Text fw={500} mb="xs">Описание проблемы</Text>
								<Card withBorder p="sm" radius="md">
									<Text>{maintenance.details || "—"}</Text>
								</Card>
							</Box>

							{maintenance.admin_message && (
								<Box>
									<Text fw={500} mb="xs">Комментарий администратора</Text>
									<Card
										withBorder
										p="sm"
										radius="md"
										bg={isRejected ? "var(--mantine-color-red-light)" : undefined}
									>
										<Text c={isRejected ? "red" : undefined}>
											{maintenance.admin_message}
										</Text>
									</Card>
								</Box>
							)}

							<Group grow>
								<Card withBorder p="sm" radius="md">
									<Text size="sm" c="dimmed">Стоимость</Text>
									<Text fw={500}>
										{maintenance.price
											? `${(maintenance.price/100).toLocaleString()} ₽`
											: "—"}
									</Text>
								</Card>

								<Card withBorder p="sm" radius="md">
									<Text size="sm" c="dimmed">Дата начала</Text>
									<Text fw={500}>{formatDate(maintenance.start_date)}</Text>
								</Card>

								<Card withBorder p="sm" radius="md">
									<Text size="sm" c="dimmed">Дата завершения</Text>
									<Text fw={500}>{formatDate(maintenance.finish_date)}</Text>
								</Card>
							</Group>

							<Button
								fullWidth
								color="blue.7"
								radius="md"
								component="a"
								href="tel:+79047382666"
							>
								Связаться с мастером
							</Button>
						</Stack>
					</Grid.Col>
				</Grid>
			</Paper>
		</Modal>
	);
}