import {
	Box,
	Button,
	Card,
	Divider,
	Flex,
	Group,
	Image,
	Stack,
	Text,
	Title
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
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
	const isMobile = useMediaQuery("(max-width: 576px)");
	const rented = quantity - available_quantity;

	return (
		<Card shadow="sm" radius="xl" withBorder p="xl">
			<Flex align="flex-start" gap="md" direction={isMobile ? "column" : "row"}>
				{/* Картинка слева */}
				<Image
					src={BASE_IMAGE_URL + image_url}
					alt={name}
					w={{ base: "100%", sm: 200 }}
					h={{ base: "100%", sm: 180 }}
					fit="contain"
					radius="md"
				/>

				{/* Справа всё остальное */}
				<Divider orientation="vertical" />

				<Stack gap="4" style={{ flex: 1 }}>
					<Group justify="space-between" align="center" gap="xl">
						<Title order={2}>{name}</Title>
						<Box style={{ flex: 1 }} visibleFrom="sm">
							<AdminBikeAvailability rented={rented} available={available_quantity} total={quantity} />
						</Box>
					</Group>

					<Text size="sm" c="dimmed">
						Макс. скорость: до {max_speed} км/ч
					</Text>

					<Text size="sm" c="dimmed">
						Пробег: до {max_range} км
					</Text>

					<Text size="sm" c="dimmed">
						Мощность: {power} Вт
					</Text>

					<Text size="sm" c="dimmed">
						Батарея: {battery}
					</Text>

					<Group justify="space-between" mt="sm">
						<Button
							variant="light"
							color="blue"
							radius="xl"
							size={isMobile ? "xs" : "md"}
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
							visibleFrom="sm"
							leftSection={<IconTrash size={16} />}
							onClick={onDelete}
						>
							Удалить
						</Button>
					</Group>
				</Stack>
			</Flex>
		</Card>
	);
}
