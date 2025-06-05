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
	lockedAccessories?: number[];
	onChangeSelected: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function AccessorySelectCardList({
	selectedAccessories,
	lockedAccessories = [],
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

	function toggleAccessory(id: number) {
		if (lockedAccessories.includes(id)) return;

		if (selectedAccessories.includes(id)) {
			onChangeSelected(selectedAccessories.filter((item) => item !== id));
		} else {
			onChangeSelected([...selectedAccessories, id]);
		}
	}

	return (
		<SimpleGrid cols={4} spacing="sm">
			{accessories_list.map((accessory) => {
				const isSelected = selectedAccessories.includes(accessory.id);
				const isLocked = lockedAccessories.includes(accessory.id);

				return (
					<Stack gap='xs'>
					<Card
						key={accessory.id}
						bg="white"
						p="lg"
						m={3}
						radius="lg"
						style={{
							position: "relative",
							display: "flex",
							flexDirection: "column",
							border: "1px solid #eee",
							outline: isSelected ? "3px solid #228be6" : "1px solid #eee",
							cursor: accessory.available_quantity > 0 && !isLocked ? "pointer" : "default",
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
											{
					isLocked && (
						<Text ta="center" size="xs" c="dimmed">
							Уже добавлен
						</Text>
					)
				}
				</Stack>
				);
			})}
		</SimpleGrid>
	);
}