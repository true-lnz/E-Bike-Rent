import {
	Card,
	Center,
	Image,
	LoadingOverlay,
	SimpleGrid,
	Stack,
	Text
} from "@mantine/core";
import { useEffect, useState } from "react";
import { BASE_IMAGE_URL } from "../../constants.ts";
import { getAllAccessories } from "../../services/accessoryService.ts";
import type { Accessory } from "../../types/accessory.ts";

export default function AccessorySelectCardList() {
	const [accessories_list, setAccessories] = useState<Accessory[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getAllAccessories()
			.then(([fetchedAccessories]) => {
				setAccessories(fetchedAccessories);
			})
			.catch((error) => console.error("Ошибка загрузки:", error))
			.finally(() => setLoading(false));
	}, []);

	if (loading) return <LoadingOverlay visible={true} zIndex={101} />;

	return (
		<SimpleGrid cols={4} spacing="sm">
			{accessories_list.map((accessories) => (
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
					<Image
						src={`${BASE_IMAGE_URL}${accessories.image_url}`}
						alt={accessories.name}
						h={60}
						fit="contain"
						style={{
							filter: accessories.available_quantity === 0 ? "grayscale(80%)" : "none",
							opacity: accessories.available_quantity === 0 ? 0.7 : 1
						}}
					/>

					<Center>
						<Text fw={600} ta="center" lineClamp={2}>
							{accessories.name}
						</Text>
					</Center>
				</Stack>
			</Card>
			))}
		</SimpleGrid>
	);
}