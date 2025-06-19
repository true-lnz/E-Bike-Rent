import {
	Box,
	Card,
	Center,
	Container,
	LoadingOverlay,
	SimpleGrid,
	Stack,
	Text,
	Title
} from "@mantine/core";
import { useEffect, useState } from "react";
import { getAllAccessories } from "../../services/accessoryService";
import type { Accessory } from "../../types/accessory";
import AccessoryCard from "./AccessoryCard";

interface AccessoriesListPageProps {
	onlyAvailableByDefault?: boolean;
	showQuantityByDefault?: boolean;
}

export default function AccessoriesList({
	onlyAvailableByDefault = false,
	showQuantityByDefault = false,
}: AccessoriesListPageProps) {
	const [accessories, setAccessories] = useState<Accessory[]>([]);
	const [loading, setLoading] = useState(true);
	const onlyAvailable = onlyAvailableByDefault;

	useEffect(() => {
		getAllAccessories()
			.then(([fetchedAccessories]) => {
				setAccessories(fetchedAccessories);
			})
			.catch((error) => console.error("Ошибка загрузки:", error))
			.finally(() => setLoading(false));
	}, []);

	if (loading) return
	<LoadingOverlay
		visible
		overlayProps={{ radius: 'sm', blur: 2 }}
		loaderProps={{ color: 'blue.5', type: 'bars' }}
	/>;

	const visibleAccessories = onlyAvailable
		? accessories.filter((accessories) => accessories.available_quantity > 0)
		: accessories;

	const noVisibleAccessories = false; /* visibleAccessories.length === 0; */

	return (
		<Container id="accessories" size="lg" py="100">
			{onlyAvailable ? (
				<Title order={1} size={45} mb="xl">
					Доступно акссесуары
				</Title>
			) : (
				<Title order={1} mb="xl" fz={{ base: "24px", xs: "32px", sm: "36px", lg: "45px", xxl: "60px" }}>
					Добавь в свою подписку
					<Box
						px={8}
						mt="xs"
						w="max-content"
						bg="orange.0"
						style={{
							borderRadius: 14,
						}}>
						<Title
							fz="inherit"
							c="orange.5"
							lh={1.1}
							style={{
								transform: "translateY(-3px)",
							}}
						>
							акссесуары
						</Title>
					</Box>
				</Title>
			)}

			{noVisibleAccessories ? (
				<Card withBorder radius="lg" p="xl">
					<Center>
						<Stack align="center" gap="md">
							<Title order={2} c="gray.7">Пока ничего нет...</Title>
							<Text size="md" c="dimmed" ta="center" maw="50%">
								К сожалению, сейчас нет доступных к аренде аксессуаров Пожалуйста, зайдите позже, возможно вам повезет!
							</Text>
						</Stack>
					</Center>
				</Card>
			) : (
				<SimpleGrid
					cols={{ base: 2, xs: 3, sm: 5, md: 6, lg: 5 }}
					spacing="md"
				>
					{visibleAccessories.map((accessories) => (
						<AccessoryCard
							key={accessories.id}
							accessory={accessories}
							showQuantity={showQuantityByDefault}
						/>
					))}
				</SimpleGrid>

			)}
		</Container>
	);
}
