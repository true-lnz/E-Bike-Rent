'use client';

import {
	Box,
	Button,
	Center,
	Container,
	Group,
	Image,
	rem,
	Stack,
	Title
} from '@mantine/core';
import { IconBrandTelegram, IconBrandVk, IconPlus } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import heroImg from "./../assets/images/kugoo-v3-max-1.png";
import RentStats from './RentStats';

export default function HeroWithStats() {
	return (
		<>
			{/* HERO СЕКЦИЯ */}
			<Box pos="relative" pt="xl" style={{ overflow: 'hidden' }} >
				{/* Фоновая геометрия — наклонный прямоугольник с закруглением */}
				<Container size="lg" pos="relative" py="xl">
					<Stack gap="0" maw={500}>
						<Title order={1} lh="1" size={90} fw={800}>
							Аренда велосипедов
						</Title>
						<Title order={1} size={70} lh="1" fw={800} c="orange.5">
							для курьеров в Уфе
						</Title>

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
								<Box
									w="60"
									h="60"
									bg="orange.5"
									component={Link}
									to={"https://t.me/lansonz"}
									style={{ borderRadius: '50%' }}
								>
									<Center h={60}>
										<IconBrandTelegram color="white" size={32} />
									</Center>
								</Box>
								<Box
									w="60"
									h="60"
									bg="orange.5"
									component={Link}
									to={"https://vk.com/true_lnz"}
									style={{ borderRadius: '50%' }}
								>
									<Center h={60}>
										<IconBrandVk color="white" size={32} />
									</Center>
								</Box>
							</Group>

						</Group>
					</Stack>
				</Container>

				<Box
					pos="absolute"
					top={0}
					right={0}
					w="680"
					h="680"
					bg="blue.7"
					style={{
						borderRadius: rem(100),
						transform: 'rotate(-12deg)',
						transformOrigin: 'top right',
						zIndex: 0,
					}}
				>
					<Image src={heroImg} style={{scale: 1.3, transform: "translateX(-100px)"}}></Image>
				</Box>

				<RentStats />

			</Box>

		</>
	);
}
