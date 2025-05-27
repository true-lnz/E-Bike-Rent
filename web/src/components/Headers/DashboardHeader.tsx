import { Box, Button, Container, Group, Image, rem, Text } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import logo from "./../../assets/images/Logo512x512.png";

export default function DashboardHeader() {
	const navigate = useNavigate();
	const { setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null); // очистить auth-контекст
      navigate("/"); // перенаправить на страницу входа
    } catch (error) {
      console.error("Ошибка при выходе:", error);
      alert("Не удалось выйти. Попробуйте позже.");
    }
  };

	return (
		<Container size="lg" component="header" py="xl" pos="sticky" top={0} style={{ zIndex: 1000 }}>
			<Box
				bg="gray.1"
				px="xl"
				py="md"
				style={{
					borderRadius: rem(24),
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				{/* Логотип + навигация */}

				<Group wrap="nowrap" gap="xl" >
					<Link to="/">
						<Image
							src={logo}
							alt="FulGaz"
							w={64}
							h={64}
							radius="sm"
						/>
					</Link>

					<Group gap="xl">
						<Text component={Link} to="dashboard/bikes" fw={500}>
							Устройства
						</Text>
						<Text component={Link} to="dashboard/my-rent" fw={500}>
							Моя аренда
						</Text>
						<Text component={Link} to="dashboard/maintenances" fw={500}>
							Обслуживание
						</Text>
						<Text component={Link} to="dashboard/contact" fw={500}>
							Контакты
						</Text>
					</Group>
				</Group>

				{/* Телефон + кнопка */}
				<Group wrap="nowrap" gap="xl">
					<Button
						size="md"
						onClick={handleLogout}
						radius="xl"
						color="orange.5"
					>
						Выйти
					</Button>
				</Group>
			</Box>
		</Container>
	);
}
