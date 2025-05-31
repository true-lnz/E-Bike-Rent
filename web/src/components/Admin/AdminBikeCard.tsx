import {
	Box,
	Button,
	Card,
	Divider,
	Group,
	Image,
	Stack,
	Text,
	Title
} from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { BASE_IMAGE_URL } from "../../constants";
import type { Bike } from "../../types/bike";
import { AdminBikeAvailability } from "./AdminBikeAvailabilty";

interface Props {
	bike: Bike;
	onEdit: () => void;
	onDelete: () => void;
}

export function AdminBikeCard({ bike, onEdit, onDelete }: Props) {
	const { name, image_url, max_speed, max_range, power, battery, quantity, available_quantity } = bike;

	const rented = quantity - available_quantity;

	return (
		<Card shadow="sm" radius="xl" withBorder p="xl">
			<Group wrap="nowrap" align="flex-start">
				{/* Картинка слева */}
				<Image
					src={BASE_IMAGE_URL + image_url}
					alt={name}
					w={200}
					h={180}
					fit="contain"
					radius="md"
				/>

				{/* Справа всё остальное */}
				<Divider orientation="vertical" />

				<Stack gap="xs" style={{ flex: 1 }}>
					<Group justify="space-between" align="center" gap="xl">
						<Title order={2}>{name}</Title>
						<Box style={{ flex: 1 }}>
							<AdminBikeAvailability rented={rented} available={available_quantity} total={quantity} />
						</Box>
					</Group>

					<Text size="sm" c="dimmed">
						Макс. скорость: до {max_speed} км/ч <br />
						Пробег: до {max_range} км <br />
						Мощность: {power} Вт <br />
						Батарея: {battery}
					</Text>

					<Group justify="space-between" mt="sm">
						<Button
							variant="light"
							color="blue"
							radius="xl"
							size="md"
							leftSection={<IconEdit size={16} />}
							onClick={onEdit}
						>
							Перейти к редактированию
						</Button>
						<Button
							variant="light"
							color="gray"
							radius="xl"
							size="md"
							leftSection={<IconTrash size={16} />}
							onClick={onDelete}
						>
							Удалить
						</Button>
					</Group>
				</Stack>
			</Group>
		</Card>
	);
}
