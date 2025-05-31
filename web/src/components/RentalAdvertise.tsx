import { Box, Button, Container, Stack, Text, Title } from '@mantine/core';

export default function RentalAdvertise() {
	return (
		<Container size="xxl" px="0" py="xl" style={{overflow: 'hidden'}}>
			<Stack gap={60}>
				{/* Block 1 */}
				<Box
					pos="relative"
				>
					{/* Right angled background */}
					<Box
						pos="absolute"
						bottom={-310}
						right={-100}
						w={650}
						h={650}
						style={{
							backgroundColor: '#FFA336',
							borderRadius: '120px',
							transform: 'rotate(45deg)',
							zIndex: 0,
						}}
					/>

					<Container size="md">
						<Box pos="relative" maw={500} mt={80}>
							<Text size="xl">🚴 Арендуйте — и зарабатывайте больше!</Text>
							<Title fz={45} mt="sm">
								Долгосрочная аренда
							</Title>
							<Title fz={45} c="blue.7">от 3 месяцев</Title>
							<Text mt="md" c="dimmed">
								Платите в 2 раза меньше, чем за бензин и ремонт — и успевайте больше заказов без
								усталости. Ваш надежный транспорт всегда под рукой!
							</Text>
							<Button mt="lg" size="md" radius="xl" color='gray' variant='light'>
								Оставить заявку
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
						bg="blue.7"
						style={{
							borderRadius: '200px',
							transform: 'rotate(-45deg)',
							zIndex: 0,
						}}
					/>

					<Box pos="relative" maw={520} ml="auto" mr="auto" pb={40}>
						<Text size="xl">⚡ Попробуйте — и убедитесь сами!</Text>
						<Title fz={45} mt="sm">
							Краткосрочная аренда
						</Title>
						<Title fz={45} c="orange.5">от 1 дня</Title>
						<Text mt="md" c="dimmed">
							Идеально для теста или подработки: платите только за дни использования, а мы обеспечим
							исправный байк и быструю поддержку 24/7!
						</Text>
						<Button mt="lg" size="md" radius="xl" color='gray' variant='light'>
							Забронировать на неделю
						</Button>
					</Box>
				</Box>
			</Stack>
		</Container>
	);
}