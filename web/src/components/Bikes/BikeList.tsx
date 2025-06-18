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
import { useAuth } from "../../hooks/useAuth";
import { getAllBikes } from "../../services/bikeService";
import type { Bike } from "../../types/bike";
import { ArrivalNotifyButton } from "../Dashboard/ArrivalNotifyButton";
import BikeCard from "./BikeCard";

interface BikeListPageProps {
	onlyAvailableByDefault?: boolean;
}

export default function BikeListPage({
	onlyAvailableByDefault = false,
}: BikeListPageProps) {
	const { user } = useAuth();


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

	if (loading) return
	<LoadingOverlay
		visible
		overlayProps={{ radius: 'sm', blur: 2 }}
		loaderProps={{ color: 'blue.5', type: 'bars' }}
	/>;

	const visibleBikes = onlyAvailable
		? bikes.filter((bike) => bike.available_quantity > 0)
		: bikes;

	const noVisibleBikes = visibleBikes.length === 0;

	return (
		<Container id="bikes" size="lg" py="xl">
			{onlyAvailable ? (
				<Title order={1} mb="xl" fz={{ base: "24px", xs: "32px", sm: "36px", lg: "45px", xxl: "60px" }}>Доступно к аренде</Title>
			) : (
				<Title order={1} mb="xl" fz={{ base: "24px", xs: "32px", sm: "36px", lg: "45px", xxl: "60px" }}>
					Выбери свою идеальную модель
					<Box
						px={8}
						mt="xs"
						w="max-content"
						bg="orange.0"
						style={{
							borderRadius: 14,
							border: "3px solid var(--mantine-color-orange-5)"
						}}>
						<Title
							fz="inherit"
							c="orange.5"
							lh={1.1}
							style={{
								transform: "translateY(-4px)",
							}}
						>
							электровелосипеда
						</Title>
					</Box>
				</Title>
			)}

			{noVisibleBikes ? (
				<Card withBorder radius="lg" p="xl">
					<Center>
						<Stack align="center" gap="md">
							<Title order={2} c="gray.7">Пока ничего нет...</Title>
							<Text size="md" c="dimmed" ta="center" maw="50%">
								К сожалению, сейчас нет доступных к аренде моделей. Пожалуйста, зайдите позже, возможно вам повезет или можете подписаться на уведомления!
							</Text>
							{user && <ArrivalNotifyButton user={user} />}

						</Stack>
					</Center>
				</Card>
			) : (
				<SimpleGrid
					cols={{ base: 1, sm: 2, md: 3 }}
					spacing="lg"
				>
					{visibleBikes.map((bike) => (
						<BikeCard key={bike.id} bike={bike} />
					))}
				</SimpleGrid>
			)}
		</Container>
	);
}
