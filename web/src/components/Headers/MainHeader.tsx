import { Anchor, Box, Button, Container, Group, Image, rem, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { NavLink } from '../Headers/NavLink';
import logo from "./../../assets/images/Logo512x512.png";

export default function Header() {
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 32);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<>
			{/* Шапка */}
			<Container size="lg" mt="xl" component="header" pos="sticky" top="0"
				style={{
					zIndex: 102,
				}}>
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
							<NavLink to="/#bikes">Аренда</NavLink>
							<NavLink to="/#accessories">Аксессуары</NavLink>
							<NavLink to="/#maintenance">Обслуживание</NavLink>
							<NavLink to="/#contact">Контакты</NavLink>
						</Group>
					</Group>

					{/* Телефон + кнопка */}
					<Group wrap="nowrap" gap="xl">
						<Anchor href="tel:+79649512810" underline="never" color="black">
							<Text fw={700} size="lg">+7 (964) 951-28-10</Text>
						</Anchor>
						<Button component={Link} size="md" to="/dashboard" radius="xl" color="orange.5">
							Личный кабинет
						</Button>
					</Group>
				</Box>
			</Container >
		</>
	);
}