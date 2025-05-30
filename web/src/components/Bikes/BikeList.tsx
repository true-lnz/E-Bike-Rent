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
import { getAllBikes } from "../../services/bikeService";
import type { Bike } from "../../types/bike";
import BikeCard from "./BikeCard";

interface BikeListPageProps {
	onlyAvailableByDefault?: boolean;
}

export default function BikeListPage({
	onlyAvailableByDefault = false,
}: BikeListPageProps) {
	const [bikes, setBikes] = useState<Bike[]>([]);
	const [loading, setLoading] = useState(true);
	const onlyAvailable = onlyAvailableByDefault;

	useEffect(() => {
		getAllBikes()
			.then(([fetchedBikes]) => {
				setBikes(fetchedBikes);
			})
			.catch((error) => console.error("Ошибка загрузки:", error))
			.finally(() => setLoading(false));
	}, []);

	if (loading) return <LoadingOverlay visible={true} zIndex={101} />;

	const visibleBikes = onlyAvailable
		? bikes.filter((bike) => bike.available_quantity > 0)
		: bikes;

	const noVisibleBikes = visibleBikes.length === 0;

	return (
		<Container id="bikes" size="lg" pt="xl">
			{onlyAvailable ? (
				<Title order={1} size={45} mb="xl">
					Доступно к аренде
				</Title>
			) : (
				<Stack mb="xl">
					<Title order={1} size={45} lh={0.5}>
						Выбери свою идеальную модель
					</Title>
					<Title order={1} size={45} c="orange.5">
						электровелосипеда
					</Title>
				</Stack>
			)}

			{noVisibleBikes ? (
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
				<SimpleGrid cols={3} spacing="lg">
					{visibleBikes.map((bike) => (
						<BikeCard key={bike.id} bike={bike} />
					))}
				</SimpleGrid>
			)}
		</Container>
	);
}
