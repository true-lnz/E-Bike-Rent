import { Box, Button, Card, Image, rem, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import type { ReactNode } from "react";

export function MaintenanceCard({
	title,
	description,
	onApplyClick,
	icon = "",
	background = "#fff",
	textColor = "black",
	btnVariant = "light"
}: {
	title: string;
	description: string;
	onApplyClick: () => void;
	icon?: string | ReactNode;
	background?: string;
	textColor?: string;
	btnVariant?: string;
}) {
	const renderIcon = () => {
		if (!icon) return null;

		if (typeof icon === 'string') {
			return <Image src={icon} width={150} alt={title} />;
		}

		return icon;
	};

	return (
		<Card
			shadow="sm"
			p="xl"
			radius="xl"
			bg={background}
			pos="relative" // Для абсолютного позиционирования иконки
			style={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
				overflow: "hidden"
			}}
		>
			{/* Абсолютно позиционированная иконка */}
			<Box
				pos="absolute"
				right={30}
				bottom={30}
				w={170}
				style={{
					zIndex: 1,
				}}
			>
				{renderIcon()}
			</Box>

			<Text fz={rem(32)} maw="90%" fw={700} c={textColor} mb="md" lh={1.2}>
				{title}
			</Text>

			{/* Контентная часть (2/3 ширины) */}
			<Box
				style={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					width: "66%",
					zIndex: 2,
					position: "relative"
				}}
			>
				<Text c={textColor} size="md" mb="auto">
					{description}
				</Text>

				{/* Кнопка всегда внизу */}
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