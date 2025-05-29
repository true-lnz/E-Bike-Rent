import {
	Card,
	Center,
	Image,
	Stack,
	Text
} from "@mantine/core";
import { BASE_IMAGE_URL } from "../constants.ts";
import type { Accessory } from "../types/accessory.ts";

interface AccessoryCardProps {
	accessory: Accessory;
}

export default function AccessoryCard({ accessory }: AccessoryCardProps) {
	return (
		<>
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
				<Stack>
					<Center>
						<Text c="dimmed" fz="xs">Доступно {accessory.available_quantity} из {accessory.quantity}</Text>
					</Center>
					<Image
						src={`${BASE_IMAGE_URL}${accessory.image_url}`}
						alt={accessory.name}
						h={120}
						fit="contain"
					/>
					<Center>
						<Text fw={600}>{accessory.name}</Text>
					</Center>
				</Stack>
			</Card>
		</>
	);
}