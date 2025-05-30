import {
	Badge,
	Card,
	Center,
	Image,
	Stack,
	Text
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
			bg="gray.0"
			p="lg"
			radius="lg"
			style={{
				position: "relative",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Stack gap="sm">
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

				<Image
					src={`${BASE_IMAGE_URL}${accessory.image_url}`}
					alt={accessory.name}
					h={120}
					fit="contain"
					style={{
						filter: accessory.available_quantity === 0 ? "grayscale(80%)" : "none",
						opacity: accessory.available_quantity === 0 ? 0.7 : 1
					}}
				/>

				<Center>
					<Text fw={600} ta="center" lineClamp={2}>
						{accessory.name}
					</Text>
				</Center>
			</Stack>
		</Card>
	);
}