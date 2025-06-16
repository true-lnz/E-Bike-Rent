import {
	Box,
	Button,
	Divider,
	Grid,
	Group,
	Image,
	Modal,
	ScrollArea,
	Spoiler,
	Stack,
	Text,
} from "@mantine/core";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BASE_IMAGE_URL } from "../../constants";
import type { Bike } from "../../types/bike";

interface BikeDetailsModalProps {
	bike: Bike;
	opened: boolean;
	onClose: () => void;
}


export default function BikeDetailsModal({
	bike,
	opened,
	onClose,
}: BikeDetailsModalProps) {
	const [expanded, setExpanded] = useState(false);

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title={`Подробнее о "${bike.name}"`}
			centered
			radius="lg"
			size="md"
			scrollAreaComponent={ScrollArea.Autosize}
		>
			<Stack>
				<Image
					src={`${BASE_IMAGE_URL}${bike.image_url}`}
					alt={bike.name}
					h={250}
					fit="contain"
					mx="auto"
				/>

				<Text fw={600} size="xl" ta="center">
					{bike.name}
				</Text>

				<Grid columns={24} gutter="xs" mt="xs">
					<Grid.Col span={12}>
						<Box>
							<Text c="dimmed" size="sm">Макс. скорость:</Text>
							<Text fw={500}>{bike.max_speed} км/ч</Text>
						</Box>
					</Grid.Col>
					<Grid.Col span={12}>
						<Box>
							<Text c="dimmed" size="sm">Запас хода:</Text>
							<Text fw={500}>{bike.max_range} км</Text>
						</Box>
					</Grid.Col>

					<Grid.Col span={12}>
						<Box>
							<Text c="dimmed" size="sm">Мощность:</Text>
							<Text fw={500}>{bike.power} Вт</Text>
						</Box>
					</Grid.Col>
					<Grid.Col span={12}>
						<Box>
							<Text c="dimmed" size="sm">Батарея:</Text>
							<Text fw={500}>{bike.battery}</Text>
						</Box>
					</Grid.Col>

					<Grid.Col span={12}>
						<Box>
							<Text c="dimmed" size="sm">Привод:</Text>
							<Text fw={500}>{bike.drive}</Text>
						</Box>
					</Grid.Col>
					<Grid.Col span={12}>
						<Box>
							<Text c="dimmed" size="sm">Рама:</Text>
							<Text fw={500}>{bike.frame}</Text>
						</Box>
					</Grid.Col>

					<Grid.Col span={12}>
						<Box>
							<Text c="dimmed" size="sm">Амортизация:</Text>
							<Text fw={500}>{bike.suspension ? "Да" : "Нет"}</Text>
						</Box>
					</Grid.Col>
					<Grid.Col span={12}>
						<Box>
							<Text c="dimmed" size="sm">Размер колеса:</Text>
							<Text fw={500}>{bike.wheel_size}"</Text>
						</Box>
					</Grid.Col>
				</Grid>

				<Divider my="xs" />


				<Group>
					<Text size="md" fw={600}>
						Цена за день: {(bike.day_price / 100).toLocaleString()} ₽
					</Text>
					<Button
						radius="xl"
						color="blue.7"
						size="sm"
						component={Link}
						to={`/bikes/${bike.id}`}
						style={{ flex: 1 }}
					>
						Далее
					</Button>
				</Group>

				<Spoiler
					showLabel="Раскрыть"
					hideLabel="Скрыть"
					maxHeight={50}
					expanded={expanded}
					onExpandedChange={setExpanded}
				>
					<Text size="sm" c="dimmed" mt="xs">
						💬 Есть возможность аренды на тестовый период, а также полноценная покупка устройства. Для более подробной информации необходимо обратиться к оператору.
					</Text>
				</Spoiler>

			</Stack>
		</Modal>
	);
}
