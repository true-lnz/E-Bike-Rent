import { Anchor, Box, Button, Center, Container, Group, Image, rem, Stack, Text, Title } from "@mantine/core";
import { IconBrandTelegram } from "@tabler/icons-react";
import logo from "../assets/images/Logo512x512.png";

export default function ContactCard() {
	return (
		<Container id="contact" size="xxl" p={0} style={{ overflow: 'hidden' }}>
			<Center>
				<Box
					pos="relative"
					p="xl"
					h={600}
					style={{
						margin: "auto",
						display: "flex",
						alignItems: "center",
					}}
				>
					{/* Подложка под логотип — за пределами левого края */}
					<Box
						pos="absolute"
						top={350}
						left={-700}
						w={1000}
						h={500}
						bg="gray.1"
						style={{
							transform: "translateY(-50%) rotate(-10deg)",
							borderRadius: rem(100),
						}}
					/>

					{/* Логотип по центру подложки */}
					<Box
						pos="relative"
						w={320}
						h={320}
						miw={120}
						style={{
							borderRadius: "9999px",
							transform: 'translateX(-170px)',
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
							h={200}
						/>
					</Box>

					{/* Контент */}
					<Box style={{ zIndex: 1 }}>
						<Stack gap={2} style={{ flex: 1 }} pl="md" mb="xl">
							<Title fz={45} lh={1.2} fw={700}>
								Давай подберём
							</Title>
							<Text fz={45} lh={1.2} fw={700} c="blue.7" mb="xl">
								оптимальное <br />
								решение для тебя
							</Text>

							<Box my="xl">
								<Anchor href="mailto:fulgaz@yandex.ru" underline="never"  c="dimmed">
									<Text size="lg" fz="xl">fulgaz@yandex.ru</Text>
								</Anchor>
								<Anchor href="tel:+79649512810" underline="never" c="dimmed">
									<Text size="lg" fz="xl">+7 (964) 951-28-10</Text>
								</Anchor>
							</Box>


							<Group mt="xs">
								<Button color="orange.5" radius="xl" size="lg" w={250} leftSection={<IconBrandTelegram></IconBrandTelegram>} >
									Написать в Телеграм
								</Button>
							</Group>
						</Stack>
					</Box>

				</Box>
			</Center>
		</Container>

	);
}
