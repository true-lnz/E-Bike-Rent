import {
	Badge,
	Card,
	Image,
	Text
} from "@mantine/core";
import { BASE_IMAGE_URL } from "../../constants.ts";
import type { Accessory } from "../../types/accessory.ts";

interface AccessoryCardProps {
	accessory: Accessory;
	showQuantity?: boolean;
	showPrice?: boolean;
}

export default function AccessoryCard({
	accessory,
	showQuantity = true,
	showPrice = true
}: AccessoryCardProps) {
	return (
		<Card
			bg="white"
			p="sm"
			radius="xl"
			withBorder
			style={{
				aspectRatio: '1',
				alignItems: "center",
				justifyContent: "space-between"
			}}
		>
			{showQuantity && (
				<Badge
					variant="light"
					color={accessory.available_quantity > 0 ? "gray" : "red"}
					size="sm"
				>
					Доступно {accessory.available_quantity} из {accessory.quantity}
				</Badge>
			)}
			{showPrice && !showQuantity && (
				<Badge
					variant="light"
					color="gray"
					size="lg"
				>
					{accessory.price / 100} ₽
				</Badge>
			)}

			<Image
				src={`${BASE_IMAGE_URL}${accessory.image_url}`}
				alt={accessory.name}
				fit="contain"
				w={{base: "80%", md: "100%"}}
				style={{
					filter: accessory.available_quantity === 0 ? "grayscale(80%)" : "none",
					opacity: accessory.available_quantity === 0 ? 0.7 : 1
				}}
			/>
			<Text fw={600} ta="center" lineClamp={1} fz="sm">
				{accessory.name}
			</Text>
		</Card>
	);
}
