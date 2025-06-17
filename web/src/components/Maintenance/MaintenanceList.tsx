// components/Maintenance/MaintenanceList.tsx
import { Button, Container, Grid, Group, Modal, Text, Title } from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import battery from "../../assets/icons/battery.png";
import bike from "../../assets/icons/bike.png";
import lightning from "../../assets/icons/lightning.png";
import settings from "../../assets/icons/settings.png";
import whench from "../../assets/icons/whench.png";
import whench2 from "../../assets/icons/whench2.png";
import { useAuth } from "../../hooks/useAuth";
import { maintenanceService } from "../../services/maintenanceService";
import { MaintenanceCard } from "./MaintenanceCard";
import { MaintenanceModal } from "./MaintenanceModal";

const mockServices = [
	{
		title: "Тормоза – безопасность прежде всего",
		description: "Проверка состояния и полная замена тормозных систем, дисков, ручек и колодок.",
		icon: bike,
		textColor: "white",
		bgColor: "orange.5",
		btnVariant: "white"
	},
	{
		title: "Аккумуляторы и защита",
		description: "Обслуживание аккумуляторов, ремонт корпуса, замена крышек и замков зажигания.",
		icon: battery
	},
	{
		title: "Рама, трансмиссия и мелочи",
		description: "Сварка трещин, замена цепи, шатунов, педалей и защиты рамы.",
		icon: whench
	},
	{
		title: "Колёса, подвеска и рулевое управление",
		description: "Восстановление вилки, руля, подшипников, установка новых ободов и седла.",
		icon: settings
	},
	{
		title: "Электроника и управление",
		description: "Настройка контроллера, ручки газа, освещения и других электронных компонентов.",
		icon: lightning,
	},
		{
		title: "Дополнительные услуги",
		description: "Вскрытие контроллера, нестандартный ремонт и мелкие доработки байка.",
		icon: whench2,
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