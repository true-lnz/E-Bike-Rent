import { ActionIcon, Badge, Button, Center, Container, Group, Paper, ScrollArea, Table, Text, Title, Tooltip } from "@mantine/core";
import { IconPhone } from "@tabler/icons-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import { maintenanceService } from "../../services/maintenanceService";
import type { Maintenance } from "../../types/maintenance";
import { MaintenanceDetailModal } from "./MaintenanceDetailModal"; // импорт

type MaintenanceHistoryProps = {
	data: Maintenance[];
	loading: boolean;
};

dayjs.extend(relativeTime);

const statusColors: Record<string, string> = {
	"заявка в обработке": "gray.2",
	"ремонтируется": "green.1",
	"готово к выдаче": "green.1",
	"отменено": "red.1",
	"завершен": "green.1",
};

const getTextColor = (status: string): string => {
	switch (status) {
		case "готово к выдаче":
			return "green";
		case "ремонтируется":
			return "green";
		case "заявка в обработке":
			return "gray";
		case "отменено":
			return "red";
		case "завершен":
			return "green";
		default:
			return "black.5";
	}
};

export function MaintenanceHistory({ data, loading }: MaintenanceHistoryProps) {
	if (loading) {
		return (
			<Container size="lg" py="xl">
				<Title order={1} mb="md">Заявки на обслуживание</Title>
				<Paper radius="lg" withBorder>
					<Center style={{ minHeight: 100 }}>
						<Text color="dimmed" size="lg">Загрузка...</Text>
					</Center>
				</Paper>
			</Container>
		);
	}

	if (!data || data.length === 0) {
		return (
			<Container size="lg" py="xl">
				<Title order={1} mb="md">Заявки на обслуживание</Title>
				<Paper radius="lg" withBorder>
					<Center style={{ minHeight: 100 }}>
						<Text color="dimmed" size="lg">Нет заявок на обслуживание</Text>
					</Center>
				</Paper>
			</Container>
		);
	}

	const [modalOpened, setModalOpened] = useState(false);
	const [selectedMaintenance, setSelectedMaintenance] = useState<Maintenance | null>(null);

	const openDetailModal = async (id: number) => {
		try {
			const result = await maintenanceService.getMaintenanceById(id);
			setSelectedMaintenance(result);
			setModalOpened(true);
		} catch (err) {
			console.error("Ошибка при загрузке деталей:", err);
		}
	};

	return (
		<Container size="lg" py="xl">
			<Title order={1} mb="md">
				Заявки на обслуживание
			</Title>

			<ScrollArea>
				<Paper radius="lg" withBorder>
					<Table striped highlightOnHover withColumnBorders>
						<Table.Thead>
							<Table.Tr>
								<Table.Th>ID</Table.Th>
								<Table.Th>Дата заявки</Table.Th>
								<Table.Th>Ваше устройство</Table.Th>
								<Table.Th>Дата принятия</Table.Th>
								<Table.Th>Время ремонта</Table.Th>
								<Table.Th>Стоимость</Table.Th>
								<Table.Th>Статус</Table.Th>
								<Table.Th>Действия</Table.Th>
							</Table.Tr>
						</Table.Thead>

						<Table.Tbody>
							{data.map((item) => {
								const formatDate = (dateStr: string) => {
									if (
										!dateStr ||
										dateStr === "0001-01-01T00:00:00Z" ||
										!dayjs(dateStr).isValid()
									) {
										return "—";
									}
									return dayjs(dateStr).format("DD.MM.YYYY");
								};

								const createdAt = formatDate(item.created_at);
								const startDate = formatDate(item.start_date);

								let repairDuration = "—";
								if (
									dayjs(item.start_date).isValid() &&
									dayjs(item.finish_date).isValid() &&
									item.start_date !== "0001-01-01T00:00:00Z" &&
									item.finish_date !== "0001-01-01T00:00:00Z"
								) {
									const start = dayjs(item.start_date);
									const end = dayjs(item.finish_date);
									const days = end.diff(start, "day");
									repairDuration = `до ${end.format("DD.MM.YYYY")} (${days} дн.)`;
								}

								return (
									<Table.Tr key={item.id}>
										<Table.Td>{item.id}</Table.Td>
										<Table.Td>{createdAt}</Table.Td>
										<Table.Td>
											<Tooltip label={item.bicycle_name || "—"}>
												<Text
													style={{
														maxWidth: 180,
														whiteSpace: "nowrap",
														overflow: "hidden",
														textOverflow: "ellipsis",
														display: "block",
													}}
												>
													{item.bicycle_name || "—"}
												</Text>
											</Tooltip>
										</Table.Td>
										<Table.Td>{startDate}</Table.Td>
										<Table.Td>{repairDuration}</Table.Td>
										<Table.Td>{item.price ? `${item.price} ₽` : "—"}</Table.Td>
										<Table.Td>
											<Badge
												size="lg"
												color={statusColors[item.status] || "gray"}
												style={{ color: getTextColor(item.status) }}
											>
												{item.status}
											</Badge>
										</Table.Td>
										<Table.Td>
											<Group gap="xs">
												<Button
													variant="outline"
													radius="md"
													size="sm"
													color="blue.7"
													onClick={() => openDetailModal(item.id)}
												>
													Детализация
												</Button>
												<ActionIcon size="lg" radius="md" color="blue.7">
													<IconPhone size={20} />
												</ActionIcon>
											</Group>
										</Table.Td>
									</Table.Tr>
								);
							})}
						</Table.Tbody>

					</Table>
				</Paper>
			</ScrollArea>

			{/* Модальное окно детализации */}
			<MaintenanceDetailModal
				opened={modalOpened}
				onClose={() => setModalOpened(false)}
				maintenance={selectedMaintenance}
			/>

		</Container>
	);
}