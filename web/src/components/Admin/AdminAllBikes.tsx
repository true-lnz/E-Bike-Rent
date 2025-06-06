import {
	Box,
	Button,
	Container,
	FileInput,
	Flex,
	Group,
	Image,
	LoadingOverlay,
	Modal,
	NumberInput,
	Stack,
	Text,
	TextInput,
	Title
} from "@mantine/core";
import { IconPhoto, IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { BASE_IMAGE_URL } from "../../constants";
import { createBike, deleteBike, getAllBikes, updateBike } from "../../services/bikeService";
import type { Bike } from "../../types/bike";
import { AdminBikeCard } from "./AdminBikeCard";

export default function AdminAllBikes() {
	const [bikes, setBikes] = useState<Bike[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
	const [newBike, setNewBike] = useState<Partial<Bike> | null>(null);
	const [editModalOpened, setEditModalOpened] = useState(false);
	const [addModalOpened, setAddModalOpened] = useState(false);
	const [deleteModalOpened, setDeleteModalOpened] = useState(false);
	const [newImage, setNewImage] = useState<File | null>(null);

	useEffect(() => {
		loadBikes();
	}, []);

	const loadBikes = () => {
		setLoading(true);
		getAllBikes()
			.then(([fetchedBikes]) => {
				setBikes(fetchedBikes);
			})
			.catch((error) => console.error("Ошибка загрузки:", error))
			.finally(() => setLoading(false));
	};

	const handleEditClick = (bike: Bike) => {
		setSelectedBike(bike);
		setNewImage(null);
		setEditModalOpened(true);
	};

	const handleAddClick = () => {
		setNewBike({
			name: '',
			weight: 0,
			max_speed: 0,
			max_range: 0,
			max_load: 0,
			power: 0,
			charge_time_hours: 0,
			battery: '',
			suspension: false,
			brakes: '',
			frame: '',
			wheel_size: 0,
			wheel_type: '',
			drive: '',
			brake_system: '',
			day_price: 0,
			quantity: 1,
			available_quantity: 1
		});
		setNewImage(null);
		setAddModalOpened(true);
	};

	const handleDeleteClick = (bike: Bike) => {
		setSelectedBike(bike);
		setDeleteModalOpened(true);
	};

	const handleSave = async () => {
		try {
			if (selectedBike) {
				console.log("Обновление велосипеда:", selectedBike);
				await updateBike(selectedBike.id, selectedBike);
			}
			setEditModalOpened(false);
			loadBikes();
		} catch (error) {
			console.error("Ошибка сохранения:", error);
		}
	};

	const handleCreate = async () => {
		if (!newBike?.name) return;

		try {
			const bikeData = new Bike();
			bikeData.append('name', newBike.name);
			bikeData.append('weight', String(newBike.weight || 0));
			// Добавьте остальные поля аналогично

			if (newImage) {
				bikeData.append('image', newImage);
			}

			await createBike(formData);
			setAddModalOpened(false);
			loadBikes();
		} catch (error) {
			console.error("Ошибка создания:", error);
		}
	};

	const handleDelete = async () => {
		try {
			console.log("Удаление велосипеда:", selectedBike?.id);
			await deleteBike(selectedBike.id);
			setDeleteModalOpened(false);
			loadBikes();
		} catch (error) {
			console.error("Ошибка удаления:", error);
		}
	};

	if (loading) return <LoadingOverlay visible={true} zIndex={101} />;

	return (
		<Container py="xl" size="lg">
			<Group justify="space-between" mb="xl">
				<Title fz={45}>Управление велосипедами</Title>
				<Button
					variant="outline"
					radius="xl"
					leftSection={<IconPlus size={18} />}
					onClick={handleAddClick}
				>
					Добавить велосипед
				</Button>
			</Group>

			<Stack gap="md">
				{bikes.map((bike) => (
					<AdminBikeCard
						key={bike.id}
						bike={bike}
						onEdit={() => handleEditClick(bike)}
						onDelete={() => handleDeleteClick(bike)}
					/>
				))}
			</Stack>

			{/* Модальное окно редактирования */}
			<Modal
				opened={editModalOpened}
				onClose={() => setEditModalOpened(false)}
				title={`Редактирование: ${selectedBike?.name || ''}`}
				size="xl"
				radius="xl"
				centered
			>
				{selectedBike && (
					<Stack gap="md">
						<Group align="flex-start" grow>
							<Box>
								<Text size="sm" fw={500} mb="3">Превью изображение:</Text>
								<Image
									src={newImage ? URL.createObjectURL(newImage) : `${BASE_IMAGE_URL}${selectedBike.image_url}`}
									alt={selectedBike.name}
									height={300}
									fit="contain"
									style={{ border: '1px solid #dee2e6', borderRadius: 'var(--mantine-radius-lg)' }}
								/>
								<Text size="xs" c="dimmed" mt="xs">Рекомендуемый размер: 1000x800</Text>

								<FileInput
									label="Заменить изображение"
									placeholder={selectedBike.image_url ? `${BASE_IMAGE_URL}${selectedBike.image_url}` : "Выберите файл"}
									accept="image/*"
									radius="md"
									mt="xs"
									rightSection={<IconPhoto size={20} />}
									onChange={setNewImage}
								/>
							</Box>

							<Stack gap="sm">
								<TextInput
									label="Название"
									value={selectedBike.name}
									radius="md"
									onChange={(e) => setSelectedBike({
										...selectedBike,
										name: e.target.value
									})}
								/>

								<Group grow>
									<NumberInput
										label="Макс. скорость (км/ч)"
										value={selectedBike.max_speed}
										radius="md"
										min={0}
										onChange={(value) => setSelectedBike({
											...selectedBike,
											max_speed: Number(value)
										})}
									/>
									<NumberInput
										label="Макс. пробег (км)"
										value={selectedBike.max_range}
										radius="md"
										min={0}
										onChange={(value) => setSelectedBike({
											...selectedBike,
											max_range: Number(value)
										})}
									/>
								</Group>

								{/* Добавьте остальные поля аналогично */}

							</Stack>
						</Group>

						<Flex justify="space-between" mt="md">
							<Button
								color="red"
								variant="outline"
								radius="md"
								leftSection={<IconTrash size={16} />}
								onClick={() => {
									setEditModalOpened(false);
									setDeleteModalOpened(true);
								}}
							>
								Удалить велосипед
							</Button>
							<Group>
								<Button variant="outline" radius="md" onClick={() => setEditModalOpened(false)}>
									Отмена
								</Button>
								<Button radius="md" onClick={handleSave}>
									Сохранить изменения
								</Button>
							</Group>
						</Flex>
					</Stack>
				)}
			</Modal>

			{/* Модальное окно подтверждения удаления */}
			<Modal
				opened={deleteModalOpened}
				onClose={() => setDeleteModalOpened(false)}
				title="Подтверждение удаления"
				size="md"
				radius="xl"
				centered
			>
				<Stack>
					<Text>Вы уверены, что хотите удалить "{selectedBike?.name}"?</Text>
					<Text size="sm" c="dimmed">Это действие нельзя отменить.</Text>

					<Group justify="flex-end" mt="md">
						<Button
							variant="outline"
							radius="md"
							onClick={() => setDeleteModalOpened(false)}
						>
							Отмена
						</Button>
						<Button
							color="red"
							radius="md"
							leftSection={<IconTrash size={16} />}
							onClick={handleDelete}
						>
							Удалить
						</Button>
					</Group>
				</Stack>
			</Modal>

			{/* Модальное окно добавления */}
			<Modal
				opened={addModalOpened}
				onClose={() => setAddModalOpened(false)}
				title="Добавление нового велосипеда"
				size="xl"
				radius="xl"
				centered
			>
				<Stack gap="md">
					<Group align="flex-start" grow>
						<Box>
							<Text size="sm" fw={500} mb="3">Превью изображения:</Text>
							{newImage ? (
								<Image
									src={URL.createObjectURL(newImage)}
									height={300}
									fit="contain"
									style={{ border: '1px solid #dee2e6', borderRadius: 'var(--mantine-radius-lg)' }}
								/>
							) : (
								<Box h={300} bg="gray.1" style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									border: '1px dashed #dee2e6',
									borderRadius: 'var(--mantine-radius-lg)'
								}}>
									<Text c="dimmed">Изображение не выбрано</Text>
								</Box>
							)}

							<Text size="xs" c="dimmed" mt="xs">Рекомендуемый размер: 1000x800</Text>

							<FileInput
								label="Изображение"
								radius="md"
								placeholder={newImage ? "Выбрано изображение" : "Выберите файл"}
								accept="image/*"
								mt="xs"
								rightSection={<IconPhoto size={20} />}
								onChange={setNewImage}
							/>
						</Box>

						<Stack gap="sm">
							<TextInput
								radius="md"
								label="Название"
								placeholder="Введите название"
								value={newBike?.name || ''}
								onChange={(e) => setNewBike({
									...newBike,
									name: e.target.value
								})}
							/>

							<Group grow>
								<NumberInput
									label="Макс. скорость (км/ч)"
									radius="md"
									min={0}
									value={newBike?.max_speed || 0}
									onChange={(value) => setNewBike({
										...newBike,
										max_speed: Number(value)
									})}
								/>
								<NumberInput
									label="Макс. пробег (км)"
									radius="md"
									min={0}
									value={newBike?.max_range || 0}
									onChange={(value) => setNewBike({
										...newBike,
										max_range: Number(value)
									})}
								/>
							</Group>

							{/* Добавьте остальные поля аналогично */}

							<FileInput
								label="Изображение"
								radius="md"
								placeholder="Выберите файл"
								accept="image/*"
								onChange={setNewImage}
							/>
						</Stack>
					</Group>

					<Group justify="flex-end" mt="md">
						<Button radius="md" variant="outline" onClick={() => setAddModalOpened(false)}>
							Отмена
						</Button>
						<Button
							radius="md"
							onClick={handleCreate}
							disabled={!newBike?.name}
							leftSection={<IconPlus size={16} />}
						>
							Создать велосипед
						</Button>
					</Group>
				</Stack>
			</Modal>
		</Container>
	);
}