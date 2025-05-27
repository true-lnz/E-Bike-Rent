// components/Maintenance/MaintenanceList.tsx
import { Container, Grid, Title } from "@mantine/core";
import { useState } from "react";
import { maintenanceService } from "../../services/maintenanceService";
import { MaintenanceCard } from "./MaintenanceCard";
import { MaintenanceModal } from "./MaintenanceModal";

const mockServices = [
	{
		title: "Регулировка переключателей",
		description: "Настройка переднего и заднего переключателей скоростей.",
	},
	{
		title: "Настройка тормозов",
		description: "Регулировка тормозных колодок, замена при необходимости.",
	},
	{
		title: "Чистка и смазка цепи",
		description: "Полная очистка и смазка трансмиссии.",
	},
	{
		title: "Прокачка гидравлики",
		description: "Обслуживание тормозной системы с заменой жидкости.",
	},
	{
		title: "Выравнивание колес",
		description: "Исправление восьмерок, проверка натяжения спиц.",
	},
	{
		title: "Полное ТО",
		description: "Комплексное техническое обслуживание велосипеда.",
	},
];

type MaintenanceListProps = {
	onCreated: () => void;
};

export function MaintenanceList({ onCreated }: MaintenanceListProps) {
	const [opened, setOpened] = useState(false);
	const [selectedTitle, setSelectedTitle] = useState("");

	const handleApply = (title: string) => {
		setSelectedTitle(title);
		setOpened(true);
	};

	const handleCreate = async (form: { bicycle_name: string; details: string }) => {
		try {
			await maintenanceService.createMaintenance(form);
			onCreated();
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<Container size="lg" py="xl">
			<Title order={1} mb="md">
				Обслуживание и ремонт
			</Title>

			<Grid gutter="xl" grow>
				{mockServices.map((service, idx) => (
					<Grid.Col span={{ base: 12, sm: 6 }} key={idx}>
						<MaintenanceCard
							title={service.title}
							description={service.description}
							onApplyClick={() => handleApply(service.title)}
						/>
					</Grid.Col>
				))}
			</Grid>

			<MaintenanceModal
				opened={opened}
				onClose={() => setOpened(false)}
				onCreate={handleCreate}
				defaultTitle={selectedTitle}
			/>
		</Container>
	);
}

