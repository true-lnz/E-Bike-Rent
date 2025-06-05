import { Anchor, Avatar, Box, Button, Container, Group, Image, rem, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { NavLink } from '../Headers/NavLink';
import logo from "./../../assets/images/Logo512x512.png";

type NavItem = {
	path: string;
	label: string;
	hash?: string;
};

export default function Header() {
	const [isScrolled, setIsScrolled] = useState(false);
	const location = useLocation();
	const { user } = useAuth();

	// Пункты меню
	const navItems: NavItem[] = [
		{ path: '/', label: 'Главная' },
		{ path: '/#bikes', label: 'Аренда', hash: '#bikes' },
		{ path: '/#accessories', label: 'Аксессуары', hash: '#accessories' },
		{ path: '/#maintenance', label: 'Обслуживание', hash: '#maintenance' },
		{ path: '/#contact', label: 'Контакты', hash: '#contact' },
	];

	// Определяем активный пункт на основе текущего URL
	const getActiveNav = () => {
		// Если есть хэш в URL, ищем соответствующий пункт меню
		if (location.hash) {
			const itemWithHash = navItems.find(item => item.hash === location.hash);
			if (itemWithHash) return itemWithHash.path;
		}

		// Если нет хэша, проверяем путь
		const currentPath = location.pathname;
		const itemWithPath = navItems.find(item => item.path === currentPath);

		return itemWithPath?.path || '/'; // По умолчанию главная
	};

	const [activeNav, setActiveNav] = useState(getActiveNav());

	// Обновляем активный пункт при изменении location
	useEffect(() => {
		setActiveNav(getActiveNav());
	}, [location.pathname, location.hash]);

	// Эффект для скролла
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 32);

			// Автоматическое определение активного пункта при скролле
			const sections = document.querySelectorAll('section[id]');
			sections.forEach(section => {
				const rect = section.getBoundingClientRect();
				if (rect.top <= 100 && rect.bottom >= 100) {
					const id = `#${section.id}`;
					const matchingItem = navItems.find(item => item.hash === id);
					if (matchingItem) {
						setActiveNav(matchingItem.path);
					}
				}
			});
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<Container size="lg" mt="xl" px="14" component="header" pos="sticky" top="0" style={{ zIndex: 102 }}>
			<Box
				px="xl"
				py="md"
				style={{
					backgroundColor: '#f2f2f7',
					borderRadius: isScrolled ? `${rem(0)} ${rem(0)} ${rem(24)} ${rem(24)}` : rem(24),
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					transition: 'border-radius 0.3s ease',
				}}
			>
				{/* Логотип + навигация */}
				<Group wrap="nowrap" gap="xl">
					<Link to="/">
						<Image src={logo} alt="FulGaz" w={64} h={64} radius="sm" />
					</Link>
					<Group gap="xl">
						{navItems.map((item) => (
							<NavLink
								key={item.path}
								to={item.path}
								active={activeNav === item.path}
							>
								{item.label}
							</NavLink>
						))}
					</Group>
				</Group>

				{/* Телефон + кнопка */}
				<Group wrap="nowrap" gap="xl">
					<Anchor href="tel:+79649512810" underline="never" color="black">
						<Text fw={700} size="lg">+7 (964) 951-28-10</Text>
					</Anchor>
					<Button component={Link} size="md" to="/dashboard" radius="xl" color="orange.5">
						<Group gap={4}>
							{user &&
								<Avatar variant='white' c="blue" size="sm" color="initials" name={user?.first_name + " " + user?.last_name} />
							}
							Личный кабинет
						</Group>
					</Button>
				</Group>
			</Box>
		</Container>
	);
}