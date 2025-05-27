import { Badge, Button, Center, Container, Group, Paper, ScrollArea, Table, Text, Title } from "@mantine/core";
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
	"в процессе": "yellow.1",
	"готово": "green.1",
	"отменено": "red.1",
};

const getTextColor = (status: string): string => {
	switch (status) {
		case "готово":
			return "green";
		case "в процессе":
			return "orange";
		case "заявка в обработке":
			return "gray";
		case "отменено":
			return "red";
		default:
			return "black.5";
	}
};

export function MaintenanceHistory({ data, loading }: MaintenanceHistoryProps) {
	if (loading) {
		return (
			<Container size="lg" py="xl">
				<Title order={2} mb="md">Заявки на обслуживание</Title>
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
				<Title order={2} mb="md">Заявки на обслуживание</Title>
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
			<Title order={2} mb="md">
				Заявки на обслуживание
			</Title>

			<ScrollArea>
				<Paper radius="lg" withBorder>
					<Table striped highlightOnHover withColumnBorders>
						<Table.Thead>
							<Table.Tr>
								<Table.Th>Дата принятия</Table.Th>
								<Table.Th>Ваше устройство</Table.Th>
								<Table.Th>Время ремонта</Table.Th>
								<Table.Th>Примерная сумма</Table.Th>
								<Table.Th>Статус</Table.Th>
								<Table.Th>Действия</Table.Th>
							</Table.Tr>
						</Table.Thead>

						<Table.Tbody>
							{data.map((item) => {
								const createdAt = dayjs(item.created_at).format("DD.MM.YYYY");
								const est = dayjs(item.estimated_time);
								const now = dayjs();
								const diffDays = est.diff(now, "day");

								return (
									<Table.Tr key={item.id}>
										<Table.Td>{createdAt}</Table.Td>
										<Table.Td>{item.bicycle_name}</Table.Td>
										<Table.Td>
											{est.format("DD.MM.YYYY")} ({diffDays} дн.)
										</Table.Td>
										<Table.Td>{item.price} ₽</Table.Td>
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
												<Button size="sm" radius="md" color="blue.7">
													Связаться
												</Button>
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