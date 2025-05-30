import { Avatar, Box, Button, Container, Group, Image, rem } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import logo from "./../../assets/images/Logo512x512.png";
import { NavLink } from './NavLink';

export default function DashboardHeader() {
	const { user, } = useAuth();
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

	const fullName = `${user?.first_name} ${user?.last_name}`;

	return (
		<Container size="lg" component="header" py="xl" style={{ zIndex: 100 }}>
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
						<NavLink to="bikes">Устройства</NavLink>
						<NavLink to="my-rents">Моя аренда</NavLink>
						<NavLink to="maintenances">Обслуживание</NavLink>
						<NavLink to="contact">Контакты</NavLink>
					</Group>
				</Group>

				{/* Телефон + кнопка */}
				<Group wrap="nowrap" gap="sm">
					<Avatar size={45} name={fullName} radius="xl"></Avatar>
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
		</Container >
	);
}
