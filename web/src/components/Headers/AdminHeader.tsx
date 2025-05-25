import { Box, Button, Container, Group, Image, rem, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import logo from "./../../assets/images/Logo512x512.png";

export default function AdminHeader() {
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
						<Text component={Link} to="#bikes" fw={500}>
							Аренда
						</Text>
						<Text component={Link} to="#accessories" fw={500}>
							Аксессуары
						</Text>
						<Text component={Link} to="#maintenance" fw={500}>
							Обслуживание
						</Text>
						<Text component={Link} to="#contact" fw={500}>
							Контакты
						</Text>
					</Group>
				</Group>

				{/* Телефон + кнопка */}
				<Group wrap="nowrap" gap="xl">
					<Text fw={700} size="lg">
						+7 (964) 951-28-10
					</Text>
					<Button
						component={Link}
						size="md"
						to="/dashboard"
						radius="xl"
						color="orange.5"
					>
						Личный кабинет
					</Button>
				</Group>
			</Box>
		</Container>
	);
}
