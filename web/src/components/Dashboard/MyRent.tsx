import { Button, Center, Container, Paper, Stack, Text, Title } from "@mantine/core";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserRents } from "../../services/rentService";
import type { Rent } from "../../types/rent";
import { RentalBikeCard } from "./RentalBikeCard";

export default function MyRent() {
	const [rents, setRents] = useState<Rent[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getUserRents()
			.then(setRents)
			.finally(() => setLoading(false));
	}, []);

	if (loading) return <div>Загрузка...</div>;

	const isActiveStatus = (status: string) =>
		status === "арендован" || status === "аренда продлена";
	const isPendingStatus = (status: string) => status === "в обработке";
	const isDeclinedStatus = (status: string) => status === "отказано";
	const isArchivedStatus = (status: string) => (status === "отказано") || (status === "завершен");

	return (
		<Container py="xl" size="lg">
			<Stack gap="xl">
				<Title order={1} mb="sm" fz={{base: "24px", xs: "32px", sm: "36px", lg: "45px", xxl: "60px"}}>Мои аренды</Title>
				
				{rents.length === 0 ? (
					<>
						<Paper radius="lg" withBorder>
							<Center style={{ minHeight: 100 }}>
								<Stack p="xl" gap="xs" align="center">
									<Text c="dimmed" size="lg">У вас сейчас нет активных заявок на аренду</Text>
									<Button radius="xl" component={Link} to="/dashboard/bikes">Перейти к выбору Устройств</Button>
								</Stack>
							</Center>
						</Paper>
					</>
				) : (
					rents.map((rent) => {
						const status = rent.status;
						const today = dayjs();
						const end = dayjs(rent.expire_date);
						if (!end.isValid()) return null;

						const start = rent.start_date ? dayjs(rent.start_date) : null;
						const daysLeft = end.diff(today, "day");

						const isActive = isActiveStatus(status);
						const isPending = isPendingStatus(status);
						const isDeclined = isDeclinedStatus(status);
						const isArchived = isArchivedStatus(status);
						const isExpired = isActive && daysLeft >= 0 && daysLeft <= 3;

						return (
							<RentalBikeCard
								key={rent.id}
								rentId={rent.id}
								bikeId={rent.bicycle.id}
								name={rent.bicycle.name}
								imageUrl={rent.bicycle.image_url}
								rentStart={start?.format("DD.MM.YYYY") || "-"}
								rentEnd={end.format("DD.MM.YYYY")}
								daysLeft={isActive ? daysLeft : undefined}
								hasAccessories={rent.accessories.length > 0}
								accessories={rent.accessories}
								status={status}
								isActive={isActive}
								isPending={isPending}
								isDeclined={isDeclined}
								isArchived={isArchived}
								isExpired={isExpired}
								onExtend={() => console.log("Продлить аренду", rent.id)}
								onContact={() => console.log("Связаться", rent.id)}
								onAddAccessory={() => console.log("Добавить аксессуар", rent.id)}
							/>
						);
					})
				)}
			</Stack>
		</Container>
	);
}
