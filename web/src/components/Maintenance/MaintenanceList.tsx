import { Container, Grid } from "@mantine/core";
import { MaintenanceCard } from "./MaintenanceCard";

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

export function MaintenanceList() {
	const handleApply = (title: string) => {
		console.log(`Заявка на услугу: ${title}`);
	};

	return (
		<Container size="lg" py="xl">
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
		</Container>
	);
}
