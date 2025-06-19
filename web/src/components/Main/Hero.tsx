'use client';

import {
	ActionIcon,
	Box,
	Button,
	Center,
	Container,
	Group,
	Image,
	rem,
	Stack,
	Text,
	Title
} from '@mantine/core';
import { IconBrandTelegram, IconPlus, IconUser } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import heroImg from "../../assets/images/kugoo-v3-max-1.png";
import RentStats from './RentStats';

export default function HeroWithStats() {
	return (
		<>
			{/* HERO СЕКЦИЯ */}
			<Box pos="relative" pt="xl" style={{ overflow: 'hidden' }}>
				{/* Фоновая геометрия — наклонный прямоугольник с закруглением */}
				<Container size="lg" pos="relative" py={{ base: "0", md: "xl" }} >
					<Stack gap="0" w={{ base: "100%", sm: "55%", md: "55%" }}>
						<Title
							order={1}
							mb="xl"
							lh={{ base: "1.2", lg: "1", xxl: "2" }}
							fz={{ base: "36px", xs: "50px", sm: "60px", md: "70px", lg: "80px", xxl: "120px" }} fw={900}
						>
							Аренда велосипедов
							<Text fz="inherit" lh="inherit" fw={900} c="orange.5">для курьеров в Уфе</Text>
						</Title>
						<Center hiddenFrom='sm' my={40}>
							<Box
								w="350"
								h="350"
								style={{
									borderRadius: rem(100),
									transform: 'rotate(-12deg)',
									zIndex: 0,
								}}
							>
								{/* XS и SM (меньше md) */}
								<Image hiddenFrom="md" src={heroImg} style={{ scale: 1.6 }} />
							</Box>
						</Center>
						<Group mt={45} gap="xl">
							<Button
								color="orange.5"
								size="xl"
								radius="xl"
								w={250}
								component='a'
								href='#bikes'
								leftSection={<IconPlus size={24} />}
							>
								Оставить заявку
							</Button>

							<Group gap="md">
								<ActionIcon
									radius="xl"
									size="62"
									variant='light'
									color='gray'
									target='_blank'
									component={Link}
									to={"https://t.me/fulgaz_ebike_rent"}
								>
									<IconBrandTelegram size={32} />
								</ActionIcon>
								<ActionIcon
									radius="xl"
									size="62"
									variant='light'
									color='gray'
									target='_blank'
									component={Link}
									to={"https://t.me/FulGaz_Ufa"}
								>
									<IconUser size={32} />
								</ActionIcon>
							</Group>
						</Group>
					</Stack>
				</Container>

				<Box
					pos="absolute"
					top={0}
					right={0}
					w={{ base: "400", xs: "350", sm: "400", md: "500", lg: "620", xl: "680" }}
					h={{ base: "400", xs: "350", sm: "400", md: "500", lg: "620", xl: "680" }}
					visibleFrom='sm'
					style={{
						borderRadius: rem(100),
						transform: 'rotate(-12deg)',
						transformOrigin: 'top right',
						background: 'linear-gradient(90deg, var(--mantine-color-blue-7), var(--mantine-color-blue-5))',

						zIndex: 0,
					}}
				>
					{/* XS и SM (меньше md) */}
					<Image visibleFrom="xs" hiddenFrom="md" src={heroImg} style={{ scale: 1.2, transform: "translateX(-30px)" }} />

					{/* MD (от md до lg) */}
					<Image visibleFrom="md" hiddenFrom="lg" src={heroImg} style={{ scale: 1.3, transform: "translateX(0px)" }} />

					{/* LG (от lg до xl) */}
					<Image visibleFrom="lg" hiddenFrom="xl" src={heroImg} style={{ scale: 1.3, transform: "translateX(0px)" }} />

					{/* XL и выше */}
					<Image visibleFrom="xl" src={heroImg} style={{ scale: 1.3, transform: "translateX(-100px)" }} />

				</Box>

				<RentStats />

			</Box>

		</>
	);
}
