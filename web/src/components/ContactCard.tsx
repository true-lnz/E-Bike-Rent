import { Box, Button, Center, Container, Group, Image, rem, Stack, Text, Title } from "@mantine/core";
import logo from "../assets/images/Logo512x512.png";

export default function ContactCard() {
	return (
		<Container size="xxl" p={0}>
			<Center>
				<Box
				pos="relative"
				p="xl"
					h={800}
				bg="white"
				style={{
					margin: "auto",
					display: "flex",
					alignItems: "center",
				}}
			>
				{/* Подложка под логотип — за пределами левого края */}
				<Box
/* 					pos="absolute"
					top="70%"
					left={-50}
					w={800}
					h={550}
					bg="#eee" */
					style={{
						transform: "translateY(-50%) rotate(-15deg)",
						borderRadius: rem(100),
					}}
				/>

				{/* Логотип по центру подложки */}
				<Box
					pos="relative"
					w={320}
					h={320}
					miw={120}
					mx="md"
					style={{
						borderRadius: "9999px",
						backgroundColor: "#fff",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Image
						src={logo} // замени на актуальный путь
						alt="FULGAZ"
						fit="contain"
						h={80}
					/>
				</Box>

				{/* Контент */}
				<Box style={{ zIndex: 1 }}>
						<Stack gap={4} style={{ flex: 1 }} pl="md">
					<Title fz={45} lh={1} fw={700}>
						Давай подберём
					</Title>
					<Text fz={45} lh={1} fw={700} c="blue.7">
						оптимальное <br />
						решение для тебя
					</Text>

					<Box mt="xl">
						<Text size="lg" c="dimmed">
							fulgaz@yandex.ru
						</Text>
						<Text size="lg" fw={700} c="dimmed">
							+7 (964) 951-28-10
						</Text>
					</Box>


					<Group mt="xs">
						<Button color="orange.5" radius="xl" size="md" w={200}>
							Написать ТГ
						</Button>
					</Group>
				</Stack>
				</Box>
				
			</Box>
			</Center>
		</Container>

	);
}
