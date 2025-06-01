// src/components/AdminMaintenanceRequests.jsx
import {
	Button,
	Container,
	Group,
	ScrollArea,
	Stack,
	Table,
	Text,
	Title,
} from "@mantine/core";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { maintenanceService } from "../../services/maintenanceService";
import type { Maintenance } from "../../types/maintenance";

export default function AdminMaintenanceRequests() {
	const [maintenances, setMaintenances] = useState<Maintenance[]>([]);

	useEffect(() => {
		maintenanceService.getAllMaintenances().then(setMaintenances);
	}, []);

	const formatDate = (date: string) =>
		date.startsWith("0001") ? "-" : dayjs(date).format("DD.MM.YYYY");

	return (
		<Container size="lg">
			<Stack>
				<Title order={2}>Заявки на обслуживание</Title>

				<ScrollArea>
					<Table striped highlightOnHover withTableBorder>
						<Table.Thead>
							<Table.Tr>
								<Table.Th>ID</Table.Th>
								<Table.Th>Пользователь</Table.Th>
								<Table.Th>Велосипед</Table.Th>
								<Table.Th>Создана</Table.Th>
								<Table.Th>Статус</Table.Th>
								<Table.Th>Детали</Table.Th>
								<Table.Th>Сообщение от админа</Table.Th>
								<Table.Th>Цена</Table.Th>
								<Table.Th>Период ремонта</Table.Th>
								<Table.Th></Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{maintenances.map((m) => (
								<Table.Tr key={m.id}>
									<Table.Td>{m.id}</Table.Td>
									<Table.Td>{m.user_id}</Table.Td>
									<Table.Td>{m.bicycle_name}</Table.Td>
									<Table.Td>{dayjs(m.created_at).format("DD.MM.YYYY HH:mm")}</Table.Td>
									<Table.Td>{m.status}</Table.Td>
									<Table.Td>{m.details}</Table.Td>
									<Table.Td>
										{m.admin_message || <Text c="dimmed">–</Text>}
									</Table.Td>
									<Table.Td>{m.price}₽</Table.Td>
									<Table.Td>
										{formatDate(m.start_date)} – {formatDate(m.finish_date)}
									</Table.Td>
									<Table.Td>
										<Group gap="xs">
											<Button size="xs" variant="light" disabled>
												Редактировать
											</Button>
										</Group>
									</Table.Td>
								</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
				</ScrollArea>
			</Stack>
		</Container>
	);
}

