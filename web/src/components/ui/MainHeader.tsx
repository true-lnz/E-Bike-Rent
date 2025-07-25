import {
	Anchor,
	Avatar,
	Box,
	Burger,
	Button,
	Container,
	Divider,
	Drawer,
	Flex,
	Group,
	Image,
	rem,
	Stack,
	Text
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import logo from './../../assets/images/Logo512x512.png';
import { NavLink } from './NavLink';

type NavItem = {
	path: string;
	label: string;
	hash?: string;
};

export default function Header() {
	const [isScrolled, setIsScrolled] = useState(false);
	const location = useLocation();
	const { user } = useAuth();
	const [activeNav, setActiveNav] = useState<string | null>(null);
	const [opened, { toggle, close }] = useDisclosure(false);
	const isMobile = useMediaQuery(`(max-width: 800px)`);


	const navItems: NavItem[] = [
		{ path: '/', label: 'Главная' },
		{ path: '/#bikes', label: 'Аренда', hash: '#bikes' },
		{ path: '/#accessories', label: 'Аксессуары', hash: '#accessories' },
		{ path: '/#maintenance', label: 'Обслуживание', hash: '#maintenance' },
		{ path: '/#contact', label: 'Контакты', hash: '#contact' },
	];

	// Определяем активный пункт на основе текущего URL
	const getActiveNav = () => {
		if (location.hash) {
			const itemWithHash = navItems.find(item => item.hash === location.hash);
			if (itemWithHash) return itemWithHash.path;
		}
		const currentPath = location.pathname;
		const itemWithPath = navItems.find(item => item.path === currentPath);
		return itemWithPath?.path || '/';
	};

	useEffect(() => {
		setActiveNav(getActiveNav());
	}, [location.pathname, location.hash]);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 32);
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

	const handleNavClick = (path: string) => {
		setActiveNav(path);
		close();
	};

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
					<Link to='/'>
						<Image src={logo} alt="FulGaz" w={64} h={64} radius="sm" />
					</Link>

				{!isMobile && (
						<Flex gap="md" rowGap={0} align="center" wrap="wrap" mr="lg">
							{navItems.map(item => (
								<NavLink
									key={item.path}
									to={item.path}
									active={activeNav === item.path}
									onClick={() => handleNavClick(item.path)}
								>
									{item.label}
								</NavLink>
							))}
						</Flex>
					)}
				</Group>

				{/* Телефон + кнопка или бургер */}
				<Group wrap="nowrap" gap="xl">
					{!isMobile ? (
						<>
							<Anchor
								href="tel:+79047382666"
								underline="never"
								color="black"
								onClick={close}
								className="nobr"
								visibleFrom='md'
							>
								<Text fw={700} size="lg" className="nobr">
									+7 (904) 738-26-66
								</Text>
							</Anchor>

							<Button
								component={Link}
								size="md"
								to="/dashboard"
								radius="xl"
								pl={user ? "8" : 'lg'}
								color="orange.5"
								onClick={close}
							>
								{user && (
									<Avatar
										variant="white"
										c="blue"
										size="sm"
										mr="xs"
										color="initials"
										name={user?.first_name + ' ' + user?.last_name}
									/>
								)}
								Личный кабинет
							</Button>

						</>
					) : (
						<Burger opened={opened} onClick={toggle} aria-label="Открыть меню" />
					)}
				</Group>
			</Box>

			{/* Drawer для мобильных */}
			<Drawer
				opened={opened}
				onClose={close}
				padding="md"
				size="60%"
				position="right"
				overlayProps={{ opacity: 0.5, blur: 4 }}
			>
				<Stack gap='md' align="stretch"> {/* spacing меньше, чем gap="sm" */}
					{navItems.map(item => (
						<NavLink
							key={item.path}
							to={item.path}
							active={activeNav === item.path}
							onClick={() => handleNavClick(item.path)}
						>
							{item.label}
						</NavLink>
					))}

					<Divider mt='xl'></Divider>

					<Anchor
						href="tel:+79047382666"
						underline="never"
						color="black"
						onClick={close}
						className="nobr"
					>
						<Text fw={700} size="lg" className="nobr">
							+7 (904) 738-26-66
						</Text>
					</Anchor>

					<Button
						component={Link}
						size="md"
						to="/dashboard"
						radius="xl"
						color="orange.5"
						fullWidth
						onClick={close}
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: '8px',
							whiteSpace: 'nowrap',
							justifyContent: 'center',
						}}
					>
						{user && (
							<Avatar
								variant="white"
								visibleFrom='md'
								c="blue"
								size="sm"
								color="initials"
								name={user?.first_name + ' ' + user?.last_name}
								style={{ flexShrink: 0 }}
							/>
						)}
						Личный кабинет
					</Button>

				</Stack>
			</Drawer>

		</Container>
	);
}
