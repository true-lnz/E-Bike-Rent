import { Box, Button, Card, Image, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import type { ReactNode } from "react";

export function MaintenanceCard({
	title,
	description,
	onApplyClick,
	icon = "",
	background = "#fff",
	textColor = "black",
	btnVariant = "light",
}: {
	title: string;
	description: string;
	onApplyClick: () => void;
	icon?: string | ReactNode;
	background?: string;
	textColor?: string;
	btnVariant?: string;
}) {
	return (
		<Card
			shadow="sm"
			p={{ base: "lg", xs: "xl" }}
			radius="xl"
			bg={background}
			pos="relative"
			style={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
				overflow: "hidden",
			}}
		>
			<Box
				pos="absolute"
				bottom={{ base: "22px", xs: "36px" }}
				right={{ base: "22px", xs: "36px" }}
				style={{ zIndex: 1 }}
			>
				<Image
					src={icon}
					alt={title}
					w={{ base: "70px", xs: "100px", sm: "120px", md: "150px", xxl: "200px" }}
					h={{ base: "70px", xs: "100px", sm: "120px", md: "150px", xxl: "200px" }}
				/>
			</Box>

			<Text
				fz={{ base: "20px", xs: "24px", sm: "32px", md: "34px", lg: "32px", xxl: "60px" }}
				fw={700}
				c={textColor}
				mb="md"
				lh={1.2}
				style={{ maxWidth: "90%" }}>
				{title}
			</Text>

			<Box
				w={{base: "80%", md: "60%"}}
				style={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					zIndex: 2,
					position: "relative",
				}}
			>
				<Text c={textColor} fz={{base: "sm", sm: "md"}} mb="auto">
					{description}
				</Text>

				<Button
					onClick={onApplyClick}
					variant={btnVariant}
					color="dark"
					radius="xl"
					size="md"
					leftSection={<IconPlus size={18} />}
					w="fit-content"
					mt="lg"
					style={{ alignSelf: "flex-start" }}
				>
					Оставить заявку
				</Button>
			</Box>
		</Card>
	);
}
