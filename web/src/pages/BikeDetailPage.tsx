import {
	Alert,
	AspectRatio,
	Button,
	Card,
	Center,
	Collapse,
	Container,
	Grid,
	Group,
	Image,
	SegmentedControl,
	Skeleton,
	Stack,
	Table,
	Text,
	Title,
	Tooltip
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconArrowLeft, IconInfoCircle, IconMoodSad, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AccessorySelectCardList from "../components/Accessory/AccessorySelectCardList";
import { BASE_IMAGE_URL, BASE_URL } from "../constants";
import { useAuth } from "../hooks/useAuth";
import { getBikeById } from "../services/bikeService";
import { createRent } from "../services/rentService";
import type { Accessory } from "../types/accessory";
import type { Bike } from "../types/bike";

export function BikeDetailPage() {
	const { id } = useParams<{ id: string }>();
	const navigator = useNavigate();
	const [bike, setBike] = useState<Bike | null>(null);
	const [loading, setLoading] = useState(true);
	const [imageLoaded, setImageLoaded] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [rentalPeriod, setRentalPeriod] = useState<string>("7");
	const [expanded, setExpanded] = useState(true);
	const { user } = useAuth();
	const [selectedAccessories, setSelectedAccessories] = useState<number[]>([]);
	const [accessories, setAccessories] = useState<Accessory[]>([]);


	useEffect(() => {
		if (!id) return;
		setLoading(true);
		setError(null);
		getBikeById(Number(id))
			.then((data) => setBike(data))
			.catch(() => setError("Ошибка при загрузке данных байка"))
			.finally(() => setLoading(false));
	}, [id]);


	useEffect(() => {
		fetch(BASE_URL + "api/accessory")
			.then((res) => res.json())
			.then((data) => setAccessories(data.items))
			.catch((err) => console.error("Ошибка загрузки аксессуаров", err));
	}, []);

	const calculatePrice = () => {
		if (!bike) return 0;

		const days = Number(rentalPeriod);
		let bikePrice = 0;

		if (days === 7) {
			bikePrice = bike.one_week_price / 100;
		} else if (days === 14) {
			bikePrice = bike.two_week_price / 100;
		} else {
			bikePrice = bike.month_price / 100;
		}

		const selectedAccessoryObjects = accessories.filter(acc =>
			selectedAccessories.includes(acc.id)
		);

		const accessoriesPrice = selectedAccessoryObjects.reduce(
			(total, acc) => total + acc.price / 100,
			0
		);

		return bikePrice + accessoriesPrice;
	};


	const handleOrderClick = () => {
		if (!bike) return;
		modals.openConfirmModal({
			title: "Подтвердите бронирование",
			centered: true,
			radius: "lg",
			children: (
				<Text size="sm">
					Вы уверены, что хотите арендовать <strong>{bike.name}</strong> на срок:{" "}
					{getRentalLabel(rentalPeriod)}?
				</Text>
			),
			labels: { confirm: "Подтвердить", cancel: "Отмена" },
			confirmProps: { color: "orange.5", radius: "md" },
			onConfirm: async () => {
				try {
					await createRent({
						bicycle_id: bike.id,
						rental_days: Number(rentalPeriod),
						accessories: selectedAccessories,
					});

					modals.open({
						title: "Заявка успешно отправлена",
						centered: true,
						radius: "lg",
						children: (
							<Stack gap="sm">
								<Text>
									С вами свяжутся по номеру телефона, указанному при регистрации.
								</Text>
								<Button
									color="orange.5"
									radius="md"
									onClick={() => {
										modals.closeAll();
										navigator("/dashboard/my-rents");
									}}
								>
									Перейти в личный кабинет
								</Button>
							</Stack>
						),
					});
				} catch (error: any) {
					document.getElementById("rentBtn")?.setAttribute("disabled", "");
					modals.open({
						title: "Ошибка в запросе аренды",
						centered: true,
						radius: "lg",
						children: (
							<Text>
								К сожалению, не удалось выполнить бронирование. Пожалуйста, попробуйте позже.
								{error.message && (
									<Text tt="capitalize" size="sm" c="red" mt="sm">
										{error.response?.data?.error}
									</Text>
								)}
							</Text>
						),
					});
				}
			},
		});
	};

	const getRentalLabel = (period: string) => {
		switch (period) {
			case "30":
				return "1 месяц";
			case "14":
				return "2 недели";
			case "7":
				return "1 неделя";
			default:
				return `${period} дней`;
		}
	};

	if (loading) {
		return (
			<Container size="lg" py="xl">
				<Skeleton height={40} width={300} mb="xl" />
				<Group align="start" gap="xl" wrap="wrap">
					<Card withBorder radius="xl" w={380} h={380}>
						<Skeleton height={380} radius="md" />
					</Card>
					<Stack style={{ flex: 1 }}>
						<Skeleton height={30} width={350} mb="md" />
						<Skeleton height={40} width={200} mt="xl" mb="xl" />
						<Skeleton height={50} width={225} mb="xl" />
						<Skeleton height={20} width={150} mb="md" />
						{[...Array(10)].map((_, i) => (
							<Group key={i} justify="space-between" w="100%">
								<Skeleton height={16} width="40%" />
								<Skeleton height={16} width="30%" />
							</Group>
						))}
					</Stack>
				</Group>
			</Container>
		);
	}

	if (error || !bike) {
		return (
			<Center style={{ height: "70vh" }}>
				<Stack align="center" gap="md">
					<IconMoodSad size={80} stroke={1.5} color="var(--mantine-color-gray-5)" />
					<Title order={1}>Велосипед не найден</Title>
					<Text c="dimmed">К сожалению, мы не смогли найти запрашиваемый велосипед</Text>
					<Button
						variant="light"
						onClick={() => navigator(-1)}
						mt="md"
						radius="xl"
						leftSection={<IconArrowLeft size={18} />}
					>
						Вернуться назад
					</Button>
				</Stack>
			</Center>
		);
	}

	const rows = [
		{ label: "Макс. скорость", value: `до ${bike.max_speed} км/ч` },
		{ label: "Запас хода", value: `до ${bike.max_range} км` },
		{ label: "Мощность двигателя", value: `${bike.power} Вт` },
		{ label: "Тип батареи", value: bike.battery },
		{ label: "Время зарядки", value: `${bike.charge_time_hours} ч` },
		{ label: "Макс. нагрузка", value: `${bike.max_load} кг` },
		{ label: "Вес", value: `${bike.weight} кг` },
		{ label: "Тормозная система", value: bike.brake_system },
		{ label: "Тип тормозов", value: bike.brakes },
		{ label: "Размер колеса", value: `${bike.wheel_size}″` },
		{ label: "Тип колеса", value: bike.wheel_type },
		{ label: "Привод", value: bike.drive },
		{ label: "Подвеска", value: bike.suspension ? "Есть" : "Нет" },
		{ label: "Рама", value: bike.frame },
	];

	return (
		<Container size="lg" py="xl">
			<Title order={1} mb="sm" fz={{ base: "24px", xs: "32px", sm: "36px", lg: "45px", xxl: "60px" }}>{bike.name}</Title>

			<Grid gutter='xl'>
				<Grid.Col span={{ base: 12, md: 6, lg: 5.5 }}>
					{!imageLoaded && <Skeleton height={360} width={360} radius="md" />}
					<AspectRatio ratio={1 / 1}>
						<Card
							withBorder
							radius='xl'
						>
							<Image
								src={BASE_IMAGE_URL + bike.image_url}
								alt={bike.name}
								w='100%'
								h='100%'
								fit="contain"
								radius="md"
								style={{ display: imageLoaded ? "block" : "none" }}
								onLoad={() => setImageLoaded(true)}
							/>
						</Card>

					</AspectRatio>
				</Grid.Col>
				<Grid.Col span={{ base: 12, md: 6, lg: 6.5 }}>
					<Stack pos="relative">
						<Text fw={500}>Выберите период аренды:</Text>
						<SegmentedControl
							value={rentalPeriod}
							onChange={setRentalPeriod}
							color="black"
							size="md"
							w={{ base: '100%', sm: '80%', lg: '60%' }}
							radius="md"
							mb="sm"
							data={[
								{ label: "7 дней", value: "7" },
								{ label: "14 дней", value: "14" },
								{ label: "1 месяц", value: "30" },
							]}
						/>

						<Text fz={28} fw={700} mt="md">
							{calculatePrice().toLocaleString()} ₽ / {getRentalLabel(rentalPeriod)}
						</Text>

						<Tooltip
							label={
								user === null
									? "Необходимо авторизоваться для аренды"
									: bike.available_quantity === 0
										? "Данный велосипед сейчас недоступен для аренды"
										: ""
							}
							disabled={user !== null && bike.available_quantity > 0}
							withArrow
						>
							<div>
								<Button
									id="rentBtn"
									color="orange.5"
									radius="xl"
									size="lg"
									w={{ base: '100%', sm: '50%', lg: '45%' }}
									onClick={handleOrderClick}
									disabled={bike.available_quantity === 0 || !user || !user?.is_verified}
								>
									Оставить заявку
								</Button>
							</div>
						</Tooltip>
						{user === null ? (
							<Alert variant="light" color="blue.7" radius="lg" title="Внимание" icon={<IconInfoCircle />}>
								Необходимо авторизоваться для бронирования
							</Alert>
						) : bike.available_quantity === 0 && (
							<Alert variant="light" color="red" radius="lg" title="Внимание" icon={<IconX />}>
								Данный велосипед сейчас недоступен для аренды, попробуйте позже.
							</Alert>
						)}


						<Stack mt="xl">
							<Text fw={600}>Выберите аксессуары к заказу</Text>
							<AccessorySelectCardList
								selectedAccessories={selectedAccessories}
								onChangeSelected={setSelectedAccessories}
							/>
						</Stack>

						<Text
							size="md"
							fw={500}
							onClick={() => setExpanded((v) => !v)}
							style={{ cursor: "pointer" }}
							mt="lg"
						>
							{expanded ? "Скрыть характеристики" : "Все характеристики"}
						</Text>

						<Collapse in={expanded}>
							<Table striped withRowBorders horizontalSpacing="md" verticalSpacing="xs">
								<Table.Tbody>
									{rows.map((row) => (
										<Table.Tr key={row.label}>
											<Table.Td w="40%">
												<Text size="sm" c="dimmed" style={{ whiteSpace: "nowrap" }}>{row.label}</Text>
											</Table.Td>
											<Table.Td>
												<Text size="sm" fw={500} style={{ wordBreak: "break-word" }}>{row.value}</Text>
											</Table.Td>
										</Table.Tr>
									))}
								</Table.Tbody>
							</Table>
						</Collapse>
					</Stack>
				</Grid.Col>
			</Grid>
		</Container>
	);
}