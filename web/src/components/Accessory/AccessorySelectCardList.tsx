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

interface AccessorySelectCardListProps {
	selectedAccessories: number[];
	onChangeSelected: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function AccessorySelectCardList({
	selectedAccessories,
	onChangeSelected,
}: AccessorySelectCardListProps) {
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

	// Обработчик клика по аксессуару
	function toggleAccessory(id: number) {
		if (selectedAccessories.includes(id)) {
			// Убираем из выбранных
			onChangeSelected(selectedAccessories.filter((item) => item !== id));
		} else {
			// Добавляем в выбранные
			onChangeSelected([...selectedAccessories, id]);
		}
	}

	return (
		<SimpleGrid cols={4} spacing="sm">
			{accessories_list.map((accessory) => {
				const isSelected = selectedAccessories.includes(accessory.id);

				return (
					<Card
						key={accessory.id}
						bg="gray.0"
						p="lg"
						radius="lg"
						style={{
							position: "relative",
							display: "flex",
							flexDirection: "column",
							border: isSelected ? "2px solid #228be6" : "1px solid #ccc",
							cursor: "pointer",
							userSelect: "none",
							opacity: accessory.available_quantity === 0 ? 0.7 : 1,
							filter: accessory.available_quantity === 0 ? "grayscale(80%)" : "none",
						}}
						onClick={() => {
							if (accessory.available_quantity > 0) {
								toggleAccessory(accessory.id);
							}
						}}
					>
						<Stack gap="sm">
							<Image
								src={`${BASE_IMAGE_URL}${accessory.image_url}`}
								alt={accessory.name}
								h={60}
								fit="contain"
							/>

							<Center>
								<Text fw={600} ta="center" lineClamp={2}>
									{accessory.name}
								</Text>
							</Center>
						</Stack>
					</Card>
				);
			})}
		</SimpleGrid>
	);
}