import {
	Box,
	Button,
	Center,
	Container,
	Group,
	Image,
	rem,
	Stack,
	Text,
	ThemeIcon,
	Title
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconBrandTelegram, IconHelp, IconMail, IconPhone } from "@tabler/icons-react";
import logo from "../../assets/images/Logo512x512.png";

export default function ContactCard() {
	// Медиа-запросы
	const isMobile = useMediaQuery("(max-width: 576px)");
	const isTablet = useMediaQuery("(max-width: 768px)");

	return (
		<Container id="contact" size="xxl" p={0} style={{ overflow: "hidden" }}>
			<Center>
				<Box
					pos="relative"
					px="xl"
					py={{ base: "0", md: 'xl' }}
					h={600}
					style={{
						margin: "auto",
						display: "flex",
						alignItems: "center",
						flexDirection: isTablet ? "column" : "row",
						textAlign: isTablet ? "center" : "left",
					}}
				>
					{/* Подложка */}
					{!isMobile && (
						<Box
							pos="absolute"
							top={isTablet ? 500 : 350}
							left={-700}
							w={1000}
							h={500}
							bg="gray.1"
							style={{
								transform: "translateY(-50%) rotate(-10deg)",
								borderRadius: rem(100),
							}}
						/>
					)}

					{/* Логотип */}
					<Box
						pos="relative"
						w={isMobile ? 180 : isTablet ? 240 : 320}
						h={isMobile ? 180 : isTablet ? 240 : 320}
						style={{
							borderRadius: "9999px",
							backgroundColor: "#fff",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							transform: isTablet ? "none" : "translateX(-170px)",
							marginBottom: isTablet ? rem(20) : 0,
							flexShrink: 0,
						}}
					>
						<Image
							src={logo}
							alt="FULGAZ"
							fit="contain"
							h={isMobile ? 120 : 200}
						/>
					</Box>

					{/* Контент */}
					<Box style={{ zIndex: 1, maxWidth: 600 }}>
						<Stack gap={4} pl={isTablet ? 0 : "md"} mb="lg">
							<Title
								fz={isMobile ? 28 : isTablet ? 36 : 45}
								lh={1}
								fw={700}
							>
								Давай подберём
							</Title>
							<Title
								fz={isMobile ? 28 : isTablet ? 36 : 45}
								lh={1.2}
								c="blue.7"
								mb={{ base: "sm", md: "lg" }}
							>
								оптимальное <br />
								решение для тебя
							</Title>

							<Box my={{ base: "sm", md: "xl" }}>
								<Group gap="xs" mb="xs">
									<ThemeIcon color="gray.5" variant="light">
										<IconMail size={20} />
									</ThemeIcon>
									<Text
										component="a"
										href="mailto:fulgaz.inforent@gmail.com"
										size="lg"
										fz={isMobile ? "md" : "xl"}
										c="dimmed"
										style={{ textDecoration: "none" }}
									>
										fulgaz.inforent@gmail.com
									</Text>
								</Group>

								<Group gap="xs" mb="xs">
									<ThemeIcon color="gray.5" variant="light">
										<IconPhone size={20} />
									</ThemeIcon>
									<Text
										component="a"
										href="tel:+79047382666"
										size="lg"
										fz={isMobile ? "md" : "xl"}
										c="dimmed"
										style={{ textDecoration: "none" }}
									>
										+7 (904) 738-26-66
									</Text>
								</Group>

									<Group gap="xs" mb="xs">
									<ThemeIcon color="gray.5" variant="light">
										<IconBrandTelegram size={20} />
									</ThemeIcon>
									<Text
										component="a"
										href="https://t.me/fulgaz_ebike_rent"
										target="_blank"
										size="lg"
										fz={isMobile ? "md" : "xl"}
										c="dimmed"
										style={{ textDecoration: "none" }}
									>
										t.me/fulgaz_ebike_rent
									</Text>
								</Group>

								<Group gap="xs">
									<ThemeIcon color="gray.5" variant="light">
										<IconHelp size={20} />
									</ThemeIcon>
									<Text
										component="a"
										href="https://t.me/FulGaz_Ufa"
										target="_blank"
										size="lg"
										fz={isMobile ? "md" : "xl"}
										c="dimmed"
										style={{ textDecoration: "none" }}
									>
										@FulGaz_Ufa (менеджер)
									</Text>
								</Group>
							</Box>


							<Group mt="xs" justify={isTablet ? "center" : "flex-start"}>
								<Button
									component="a"
									href="https://t.me/FulGaz_Ufa"
									target="_blank"
									color="orange.5"
									radius="xl"
									size={isMobile ? "md" : "lg"}
									leftSection={<IconBrandTelegram />}
								>
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
