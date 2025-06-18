import {
	Badge,
	Card,
	Center,
	Image,
	Stack,
	Text,
	rem
} from "@mantine/core";
import { BASE_IMAGE_URL } from "../../constants.ts";
import type { Accessory } from "../../types/accessory.ts";

interface AccessoryCardProps {
	accessory: Accessory;
	showQuantity?: boolean;
}

export default function AccessoryCard({
	accessory,
	showQuantity = true
}: AccessoryCardProps) {
	return (
		<Card
			bg="white"
			p="sm"
			radius="xl"
			withBorder
			style={{
				aspectRatio: '1', // делает карточку квадратной
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				width: "100%",
				boxSizing: "border-box",
			}}
		>
			<Stack gap="xs" h="100%" justify="space-between">
				{showQuantity && (
					<Center>
						<Badge
							variant="light"
							color={accessory.available_quantity > 0 ? "gray" : "red"}
							size="sm"
						>
							Доступно {accessory.available_quantity} из {accessory.quantity}
						</Badge>
					</Center>
				)}

				<Center h="100%">
					<Image
						src={`${BASE_IMAGE_URL}${accessory.image_url}`}
						alt={accessory.name}
						fit="contain"
						style={{
							maxHeight: rem(100),
							filter: accessory.available_quantity === 0 ? "grayscale(80%)" : "none",
							opacity: accessory.available_quantity === 0 ? 0.7 : 1
						}}
					/>
				</Center>

				<Center>
					<Text fw={600} ta="center" lineClamp={2} fz="sm">
						{accessory.name}
					</Text>
				</Center>
			</Stack>
		</Card>
	);
}
