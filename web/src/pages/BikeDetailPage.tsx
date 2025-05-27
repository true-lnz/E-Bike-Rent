import {
	Button,
	Card,
	Center,
	Collapse,
	Container,
	Group,
	Image,
	Loader,
	SegmentedControl,
	Stack,
	Table,
	Text,
	Title
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBikeById } from "../services/bikeService";
import type { Bike } from "../types/bike";

export function BikeDetailPage() {
	const { id } = useParams<{ id: string }>();
	const [bike, setBike] = useState<Bike | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [rentalPeriod, setRentalPeriod] = useState("7");
	const [expanded, setExpanded] = useState(true);

	useEffect(() => {
		if (!id) return;

		setLoading(true);
		setError(null);

		getBikeById(Number(id))
			.then((data) => setBike(data))
			.catch(() => setError("Ошибка при загрузке данных байка"))
			.finally(() => setLoading(false));
	}, [id]);

	const calculatePrice = () => {
		if (!bike) return 0;
		switch (rentalPeriod) {
			case "7":
				return bike.day_price * 7;
			case "14":
				return bike.day_price * 14;
			case "30":
				return bike.day_price * 30;
			default:
				return bike.day_price;
		}
	};

	const handleOrderClick = () => {
		alert("Заказ оформлен!");
	};

	if (loading) {
		return (
			<Center style={{ height: "100vh" }}>
				<Loader size="lg" />
			</Center>
		);
	}

	if (error) {
		return (
			<Center style={{ height: "100vh" }}>
				<Text color="red">{error}</Text>
			</Center>
		);
	}

	if (!bike) {
		return (
			<Center style={{ height: "100vh" }}>
				<Text>Велосипед не найден</Text>
			</Center>
		);
	}

	const rows = [
		{ label: "Макс. скорость", value: `до ${bike.max_speed} км/ч` },
		{ label: "Пробег", value: `до ${bike.max_range} км` },
		{ label: "Мощность", value: `${bike.power} Вт` },
		{ label: "Батарея", value: bike.battery },
		{ label: "Зарядка", value: `${bike.charge_time_hours} часов` },
		{ label: "Нагрузка", value: `${bike.max_load} кг` },
		{ label: "Ёмкость", value: `${bike.power / 12} Ah` },
		{ label: "Тормоза", value: bike.brake_system },
		{ label: "Шины", value: `${bike.wheel_size}×${bike.wheel_type}` },
		{ label: "Вес", value: `${bike.weight} кг` },
	];

	return (
		<Container size="lg" py="xl">
			<Title order={1} mb="xl">{bike.name}</Title>

			<Group align="start" justify="space-between" gap="xl" wrap="nowrap">
				<Card withBorder radius="xl" >
					<Image
						src={"http://localhost:8080/uploads/kolyan-1.png"} /*  + bike.image_url} */
						alt={bike.name}
						width={380}
						height={380}
						fit="contain"
						radius="md"
					/>
				</Card>

				<Stack style={{ flex: 1 }} justify="space-between">
					<div>
						<Text fw={500} mb="xs">Выберите период аренды:</Text>
						<SegmentedControl
							value={rentalPeriod}
							onChange={setRentalPeriod}
							color="black"
							size="md"
							w={350}
							data={[
								{ label: "7 дней", value: "7" },
								{ label: "14 дней", value: "14" },
								{ label: "1 месяц", value: "30" },
							]}
							radius="md"
							mb="sm"
						/>

						<Text fz={32} fw={700} mt="xl" mb="sm">
							{calculatePrice().toLocaleString()} ₽ / {rentalPeriod === "30" ? "месяц" : "неделя"}
						</Text>

						<Button
							color="orange"
							radius="xl"
							size="lg"
							w={225}
							onClick={handleOrderClick}
							mb="sm"
						>
							Оставить заявку
						</Button>

						<Text
							size="md"
							fw={500}
							onClick={() => setExpanded((v) => !v)}
							style={{ cursor: "pointer" }}
							mb="xs"
							mt="md"
						>
							{expanded ? (
								<Group gap={4} wrap="nowrap">
									Скрыть характеристики
								</Group>
							) : (
								<Group gap={4} wrap="nowrap">
									Все характеристики
								</Group>
							)}
						</Text>

						<Collapse in={expanded}>
							<Table
								withRowBorders
							>
								<Table.Tbody>
									{rows.map((row) => (
										<Table.Tr key={row.label}>
											<Table.Td><Text c="dimmed">{row.label}</Text></Table.Td>
											<Table.Td><Text fw={500}>{row.value}</Text></Table.Td>
										</Table.Tr>
									))}
								</Table.Tbody>
							</Table>
						</Collapse>

					</div>
				</Stack>
			</Group>
		</Container>
	);
}