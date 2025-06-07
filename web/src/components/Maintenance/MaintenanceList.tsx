// components/Maintenance/MaintenanceList.tsx
import { Button, Container, Grid, Group, Modal, Text, Title } from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import battery from "../../assets/icons/battery.png";
import bike from "../../assets/icons/bike.png";
import lightning from "../../assets/icons/lightning.png";
import settings from "../../assets/icons/settings.png";
import wash from "../../assets/icons/wash.png";
import whench from "../../assets/icons/whench.png";
import { useAuth } from "../../hooks/useAuth";
import { maintenanceService } from "../../services/maintenanceService";
import { MaintenanceCard } from "./MaintenanceCard";
import { MaintenanceModal } from "./MaintenanceModal";

const mockServices = [
	{
		title: "Комплексная диагностика электровелосипеда",
		description: "Проверка состояния основных узлов: тормоза, цепь, звёзды, переключатели, колёса.",
		icon: bike,
		textColor: "white",
		bgColor: "orange.5",
		btnVariant: "white"
	},
	{
		title: "Диагностика электросистемы",
		description: "Проверка состояния аккумулятора, контроллера, дисплея и электропроводки.",
		icon: battery
	},
	{
		title: "Регулировка тормозов и переключателей",
		description: "Настройка переднего и заднего переключателей, тормозных ручек, колодок или дисков.",
		icon: whench
	},
	{
		title: "Комплексная мойка и смазка",
		description: "Полная очистка велосипеда, чистка цепи, смазка подвижных узлов.",
		icon: wash
	},
	{
		title: "Замена цепи и кассеты",
		description: "Снятие изношенных элементов трансмиссии и установка новых.",
		icon: settings
	},
	{
		title: "Прошивка и обновление ПО",
		description: "Установка обновлений для бортового компьютера, дисплея и контроллера.",
		icon: lightning,
		textColor: "white",
		bgColor: "blue.7",
		btnVariant: "white"
	},
];

type MaintenanceListProps = {
	onCreated: () => void;
};

export function MaintenanceList({ onCreated }: MaintenanceListProps) {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [opened, setOpened] = useState(false);
	const [authModalOpened, setAuthModalOpened] = useState(false);
	const [selectedTitle, setSelectedTitle] = useState("");

	const handleApply = (title: string) => {
		if (!user) {
			setAuthModalOpened(true);
			return;
		}
		setSelectedTitle(title);
		setOpened(true);
	};

	const handleCreate = async (form: { bicycle_name: string; details: string }) => {
		try {
			await maintenanceService.createMaintenance(form);
			onCreated();
			setOpened(false);
		} catch (err) {
			console.error(err);
		}
	};

	const handleAuthRedirect = () => {
		setAuthModalOpened(false);
		navigate("/auth");
	};

	return (
		<Container id="maintenance" size="lg" py="xl">
			<Title order={1} mb="xl" fz={{ base: "24px", xs: "32px", sm: "36px", lg: "45px", xxl: "60px" }}>Обслуживание и ремонт</Title>

			<Grid gutter="xl" grow>
				{mockServices.map((service, idx) => (
					<Grid.Col span={{ base: 12, sm: 6 }} key={idx}>
						<MaintenanceCard
							title={service.title}
							description={service.description}
							icon={service.icon}
							textColor={service.textColor}
							background={service.bgColor}
							btnVariant={service.btnVariant}
							onApplyClick={() => handleApply(service.title)}
						/>
					</Grid.Col>
				))}
			</Grid>

			{/* Модальное окно для авторизованных пользователей */}
			<MaintenanceModal
				opened={opened}
				onClose={() => setOpened(false)}
				onCreate={handleCreate}
				defaultTitle={selectedTitle}
			/>

			{/* Модальное окно для неавторизованных пользователей */}
			<Modal
				opened={authModalOpened}
				onClose={() => setAuthModalOpened(false)}
				title="Требуется авторизация"
				radius="lg"
				centered
			>
				<Text mb="md">
					Для оформления заявки на обслуживание необходимо войти в систему или зарегистрироваться.
				</Text>
				<Group justify="center">
					<Button
						variant="outline"
						radius="md"
						onClick={() => setAuthModalOpened(false)}
					>
						Отмена
					</Button>
					<Button
						color="orange.5"
						radius="md"
						onClick={handleAuthRedirect}
					>
						Войти / Зарегистрироваться
					</Button>
				</Group>
			</Modal>
		</Container>
	);
}