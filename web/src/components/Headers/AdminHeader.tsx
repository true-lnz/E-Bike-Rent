import { Badge, Box, Button, Container, Group, Image, rem } from '@mantine/core';
import { Link } from 'react-router-dom';
import logo from "./../../assets/images/Logo512x512.png";
import { NavLink } from './NavLink';

export default function AdminHeader() {

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

					<Group gap="md">
						<NavLink to="rent-requests">Заявки на аренду</NavLink>
						<NavLink to="maintenance-requests">Заявки на обслуживание</NavLink>
						<NavLink to="all-bikes">Все велосипеды</NavLink>
						<NavLink to="all-accessories">Все аксессуары</NavLink>
					</Group>
				</Group>

				{/* Телефон + кнопка */}
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
