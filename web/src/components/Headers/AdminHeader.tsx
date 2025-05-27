import { Box, Button, Container, Group, Image, rem, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import logo from "./../../assets/images/Logo512x512.png";

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

					<Group gap="xl">
						<Text component={Link} to="rent-requests" fw={500}>
							Заявки на аренду
						</Text>
						<Text component={Link} to="maintenance-requests" fw={500}>
							Заявки на обслуживание
						</Text>
						<Text component={Link} to="all-bikes" fw={500}>
							Все велосипеды
						</Text>
						<Text component={Link} to="all-accessories" fw={500}>
							Все аксессуары
						</Text>
					</Group>
				</Group>

				{/* Телефон + кнопка */}
				<Group wrap="nowrap" gap="xl">
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
