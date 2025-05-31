import { Badge, Box, Button, Container, Group, Image, rem } from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';
import logo from "./../../assets/images/Logo512x512.png";
import { NavLink } from './NavLink';

type NavItem = {
	path: string;
	label: string;
};

export default function AdminHeader() {
	const location = useLocation();

	// Пункты меню администратора
	const navItems: NavItem[] = [
		{ path: 'rent-requests', label: 'Заявки на аренду' },
		{ path: 'maintenance-requests', label: 'Заявки на обслуживание' },
		{ path: 'all-bikes', label: 'Все велосипеды' },
		{ path: 'all-accessories', label: 'Все аксессуары' },
	];

	// Определяем активный пункт на основе URL
	const getActiveNav = () => {
		const currentPath = location.pathname.split('/').pop() || '';
		return navItems.find(item => item.path === currentPath)?.path || '';
	};

	return (
		<Container size="lg" component="header" py="xl" px="14" style={{ zIndex: 100 }}>
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
				<Group wrap="nowrap" gap="xl">
					<Link to="/">
						<Image
							src={logo}
							alt="FulGaz"
							w={64}
							h={64}
							radius="sm"
						/>
					</Link>

					<Group gap="md">
						{navItems.map((item) => (
							<NavLink
								key={item.path}
								to={item.path}
								active={getActiveNav() === item.path}
							>
								{item.label}
							</NavLink>
						))}
					</Group>
				</Group>

				{/* Бейдж + кнопка */}
				<Group wrap="nowrap" gap="sm">
					<Badge variant="outline">Админ-панель</Badge>
					<Button
						component={Link}
						size="md"
						to="/dashboard"
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