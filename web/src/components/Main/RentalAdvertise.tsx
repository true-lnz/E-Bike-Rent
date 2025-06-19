import { Box, Button, Container, Image, Stack, Text, Title } from '@mantine/core';
import vel2Img from "../../assets/images/kolyan-2.png";
import vel1Img from "../../assets/images/liming-v8-1.png";

export default function RentalAdvertise() {
	return (
		<Container size="xxl" px="0" py="xl" style={{ overflow: 'hidden' }} visibleFrom='lg'>
			<Stack gap={60}>
				{/* Block 1 */}
				<Box
					pos="relative"
				>
					{/* Right angled background */}
					<Box
						pos="absolute"
						bottom={-320}
						right={-100}
						w={650}
						h={650}
						style={{
							backgroundColor: '#FFA336',
							background: 'linear-gradient(-90deg, var(--mantine-color-yellow-7), var(--mantine-color-orange-5))',
							borderRadius: '120px',
							transform: 'rotate(45deg)',
							zIndex: 0,
						}}
					>
						<Image w={1000} src={vel2Img} style={{ transform: "translateX(-150px) translateY(-100px)  rotate(-55deg)" }}></Image>

					</Box>

					<Container size="md">
						<Box pos="relative" maw={500} mt={80}>
							<Text size="xl">🚴 Арендуйте — и зарабатывайте больше!</Text>
							<Title fz={45} my="4">
								Долгосрочная аренда
							</Title>
							<Box
								px={8}
								w="max-content"
								bg="blue.0"
								style={{
									borderRadius: "14px",
								}}>
								<Title
									fz={45}
									lh={1.1}
									c="blue.7"
									style={{
										transform: "translateY(-3px)",
									}}
								>
									от 3 месяцев
								</Title>
							</Box>
							<Text mt="md" c="dimmed">
								Платите в 2 раза меньше, чем за бензин и ремонт — и успевайте больше заказов без
								усталости. Ваш надежный транспорт всегда под рукой!
							</Text>
							<Button mt="lg" size="md" radius="xl" color='gray' variant='light' component='a' href='#bikes'>
								Перейти к каталогу
							</Button>
						</Box>
					</Container>

				</Box>

				{/* Block 2 */}
				<Box
					pos="relative"
					p="lg"
				>
					{/* Left angled background */}
					<Box
						pos="absolute"
						top={-460}
						left={-910}
						w={1050}
						h={1050}
						style={{
							borderRadius: '200px',
							transform: 'rotate(-45deg)',
							background: 'linear-gradient(45deg, var(--mantine-color-blue-7), var(--mantine-color-blue-5))',
							zIndex: 0,
						}}
					>
						<Image w={700} src={vel1Img} style={{ transform: "translateX(550px) translateY(550px)  rotate(55deg) scale(-1, 1)" }}></Image>
					</Box>

					<Box pos="relative" maw={520} ml="auto" mr="auto" pb={40}>
						<Text size="xl">⚡ Вернём вашему байку — скорость!</Text>
						<Title fz={45} my="4">
							Техобслуживание
						</Title>
						<Title fz={45} c="orange.5"></Title>
						<Box
							px={8}
							w="max-content"
							bg="orange.0"
							style={{
								borderRadius: "14px",
							}}>
							<Title
								fz={45}
								fw={700}
								lh={1.1}
								c="orange.5"
								style={{
									transform: "translateY(-3px)",
								}}
							>
								электробайка
							</Title>
						</Box>
						<Text mt="md" c="dimmed">
							Техническое обслуживание, замена комплектующих и настройка электроники по доступным ценам — с гарантией качества.
						</Text>
						<Text fz="sm" c="dimmed" fs="italic">
							* Цены могут меняться в зависимости от сложности работ. Точную стоимость уточняйте у мастера.
						</Text>
						<Button mt="lg" size="md" radius="xl" color='gray' variant='light' component='a' href='#maintenance'>
							Оставить заявку
						</Button>
					</Box>
				</Box>
			</Stack>
		</Container>
	);
}