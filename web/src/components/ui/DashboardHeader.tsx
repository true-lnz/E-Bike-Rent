import {
	Avatar,
	Box,
	Burger,
	Button,
	Container,
	Divider,
	Drawer,
	em,
	Group,
	HoverCard,
	Image,
	rem,
	Stack,
	Text,
	Title,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { IconLogout } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BASE_IMAGE_URL } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import { logout } from '../../services/authService';
import logo from './../../assets/images/Logo512x512.png';
import { NavLink } from './NavLink';

type NavItem = {
	path: string;
	label: string;
};

export default function DashboardHeader() {
	const { user, setEmail, setUser, setIsVerified } = useAuth();
	const location = useLocation();
	const [activeNav, setActiveNav] = useState<string | null>(null);
	const [opened, { toggle, close }] = useDisclosure(false);
	const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

	const navItems: NavItem[] = [
		{ path: 'bikes', label: 'Устройства' },
		{ path: 'my-rents', label: 'Моя аренда' },
		{ path: 'maintenances', label: 'Обслуживание' },
		{ path: 'contact', label: 'Контакты' },
	];

	dayjs.locale('ru');

	useEffect(() => {
		const currentPath = location.pathname.split('/').pop() || 'bikes';
		setActiveNav(currentPath);
	}, [location.pathname]);

	const handleNavClick = (path: string) => {
		setActiveNav(path);
		close();
	};

	const handleLogout = () => {
		document.cookie = 'token=; Max-Age=0; path=/';
		setUser(null);
		setEmail('');
		setIsVerified(false);
		logout();
		window.location.reload();
	};

	const fullName = `${user?.first_name} ${user?.last_name}`;

	return (
		<Container size="lg" component="header" px="14" py="xl" style={{ zIndex: 100 }}>
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
				{/* Лого */}
				<Group wrap="nowrap" gap="xl">
					<Link to="/">
						<Image src={logo} alt="FulGaz" w={64} h={64} radius="sm" />
					</Link>
				</Group>

				{/* Навигация */}
				{!isMobile && (
					<Group gap="sm" ml='xl' mr="auto">
						{navItems.map((item) => (
							<NavLink
								key={item.path}
								to={item.path}
								active={activeNav === item.path}
								onClick={() => handleNavClick(item.path)}
							>
								{item.label}
							</NavLink>
						))}
					</Group>
				)}

				{/* Справа: аватар или бургер */}
				<Group wrap="nowrap" gap="sm">
					{!isMobile ? (
						<>
							<HoverCard
								width={280}
								shadow="md"
								radius="lg"
								withArrow
								openDelay={100}
								closeDelay={400}
							>
								<HoverCard.Target>
									<Avatar size={45} name={fullName} radius="xl" />
								</HoverCard.Target>
								<HoverCard.Dropdown p="lg">
									<Stack gap="xs">
										<Title order={4}>{fullName}</Title>
										<Text size="sm" c="dimmed" lineClamp={2}>
											{user?.email}
										</Text>
										<Text size="sm" c="dimmed">
											Город: {user?.city ? user?.city : "нет информации"}
										</Text>
										<Text size="sm" c="dimmed">
											Телефон: {user?.phone_number}
										</Text>
										<Text size="sm" c="dimmed">
											Дата рождения: {dayjs(user?.birthday).format("DD MMMM YYYY")} г.
										</Text>

										{user?.company && (
											<>
												<Divider my="xs" />
												<Group gap="sm" align="center">
													<Box
														style={{
															width: 40,
															height: 40,
															borderRadius: 6,
															overflow: 'hidden',
															boxShadow: '0 0 5px rgba(0,0,0,0.1)',
															flexShrink: 0,
														}}
													>
														<Image
															src={BASE_IMAGE_URL + 'companies/' + user?.company.image_url}
															alt={user?.company.name}
															width={40}
															height={40}
															fit="cover"
														/>
													</Box>
													<Text size="sm" fw={500}>
														{user?.company.name}
													</Text>
												</Group>
											</>
										)}

										<Divider my="sm" />
										<Text size="xs" c={user?.is_verified ? 'teal' : 'red'}>
											{user?.is_verified ? 'Подтвержденный аккаунт' : 'Пользователь не подтверждён'}
										</Text>
										<Text size="xs" c="dimmed">
											Роль: {user?.role === 'user' ? 'пользователь' : 'администратор'}
										</Text>
									</Stack>
								</HoverCard.Dropdown>
							</HoverCard>

							<Button
								size="md"
								onClick={handleLogout}
								radius="xl"
								color="orange.5"
								style={{ whiteSpace: 'nowrap' }}
								leftSection={<IconLogout size={16} />}
							>
								Выйти
							</Button>
						</>
					) : (
						<Burger opened={opened} onClick={toggle} aria-label="Открыть меню" />
					)}
				</Group>
			</Box>

			{/* Drawer справа */}
			<Drawer
				opened={opened}
				onClose={close}
				padding="md"
				size="70%"
				position="right"
				overlayProps={{ opacity: 0.5, blur: 4 }}
			>
				<Stack gap="sm" align="flex-start">
					{/* Навигация */}
					{navItems.map((item) => (
						<NavLink
							key={item.path}
							to={item.path}
							active={activeNav === item.path}
							onClick={() => handleNavClick(item.path)}
						>
							{item.label}
						</NavLink>
					))}

					<Divider my="sm" />

					<Stack gap={8}>
						{/* Пользовательская информация */}
						<Text size="sm" fw={500}>
							{fullName}
						</Text>
						<Text size="xs" c="dimmed">
							{user?.email}
						</Text>
						<Text size="sm" c="dimmed">
							Город: {user?.city ? user?.city : "нет информации"}
						</Text>
						<Text size="xs" c="dimmed">
							Телефон: {user?.phone_number}
						</Text>
						<Text size="xs" c="dimmed">
							Дата рождения: {dayjs(user?.birthday).format("DD MMMM YYYY")} г.
						</Text>

						{user?.company && (
							<Group gap="sm" align="center" mt="xs">
								<Box
									style={{
										width: 32,
										height: 32,
										borderRadius: 6,
										overflow: 'hidden',
										boxShadow: '0 0 5px rgba(0,0,0,0.1)',
										flexShrink: 0,
									}}
								>
									<Image
										src={BASE_IMAGE_URL + 'companies/' + user?.company.image_url}
										alt={user?.company.name}
										width={32}
										height={32}
										fit="cover"
									/>
								</Box>
								<Text size="sm" fw={500}>
									{user?.company.name}
								</Text>
							</Group>
						)}
						<Text size="xs" c={user?.is_verified ? 'teal' : 'red'}>
							{user?.is_verified ? 'Подтвержденный аккаунт' : 'Пользователь не подтверждён'}
						</Text>
						<Text size="xs" c="dimmed">
							Роль: {user?.role === 'user' ? 'пользователь' : 'администратор'}
						</Text>
					</Stack>

					<Button
						fullWidth
						variant="light"
						color="orange.5"
						radius="xl"
						mt="md"
						onClick={() => {
							handleLogout();
							close();
						}}
						style={{ whiteSpace: 'nowrap' }}
					>
						Выйти
					</Button>
				</Stack>
			</Drawer>

		</Container>
	);
}
