import {
	Button,
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
import { getAllAccessories } from "../services/accessoryService";
import type { Accessory } from "../types/accessory";
import AccessoryCard from "./AccessoryCard";

interface AccessoriesListPageProps {
	onlyAvailableByDefault?: boolean;
}

export default function AccessoriesList({
	onlyAvailableByDefault = false,
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

	if (loading) return <LoadingOverlay visible={true} zIndex={101} />;

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
				<Stack mb="xl">
					<Title order={1} size={45} lh={0.5}>
						Добавь в свою подписку
					</Title>
					<Title order={1} size={45} c="orange.5">
						акссесуары
					</Title>
				</Stack>
			)}

			{noVisibleAccessories ? (
				<Card withBorder radius="lg" p="xl">
					<Center>
						<Stack align="center" gap="md">
							<Title order={2} c="gray.7">Пока ничего нет...</Title>
							<Text size="md" c="dimmed" ta="center" maw="50%">
								К сожалению, сейчас нет доступных к аренде моделей. Пожалуйста, зайдите позже, возможно вам повезет или можете подписаться на уведомления!
							</Text>
							<Button color="blue.7" radius="xl" size="md">
								Уведомить о поступлении
							</Button>
						</Stack>
					</Center>
				</Card>
			) : (
				<SimpleGrid cols={5} spacing="sm">
					{visibleAccessories.map((accessories) => (
						<AccessoryCard key={accessories.id} accessory={accessories} />
					))}
				</SimpleGrid>
			)}
		</Container>
	);
}
