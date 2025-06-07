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
	SimpleGrid,
	Stack,
	Text,
	TextInput,
	Title
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconPlus, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { BASE_IMAGE_URL } from "../../constants";
import { createAccessory, deleteAccessory, getAllAccessories, updateAccessory } from "../../services/accessoryService";
import type { Accessory } from "../../types/accessory";
import AccessoryCard from "../Accessory/AccessoryCard";

export default function AdminAllAccessories() {
	const [accessories, setAccessories] = useState<Accessory[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedAccessory, setSelectedAccessory] = useState<Accessory | null>(null);
	const [newAccessory, setNewAccessory] = useState<Partial<Accessory> | null>(null);
	const [editModalOpened, setEditModalOpened] = useState(false);
	const [addModalOpened, setAddModalOpened] = useState(false);
	const [deleteModalOpened, setDeleteModalOpened] = useState(false);
	const [newImage, setNewImage] = useState<File | null>(null);

	useEffect(() => {
		loadAccessories();
	}, []);

	const loadAccessories = () => {
		setLoading(true);
		getAllAccessories()
			.then(([fetchedAccessories]) => {
				setAccessories(fetchedAccessories);
			})
			.catch((error) => console.error("Ошибка загрузки:", error))
			.finally(() => setLoading(false));
	};

	const handleCardClick = (accessory: Accessory) => {
		setSelectedAccessory(accessory);
		setNewImage(null);
		setEditModalOpened(true);
	};

	const handleAddClick = () => {
		setNewAccessory({
			name: '',
			quantity: 0,
			available_quantity: 0,
			image_url: ''
		});
		setNewImage(null);
		setAddModalOpened(true);
	};

	const handleSave = async () => {
		try {
			if (selectedAccessory) {
				await updateAccessory(selectedAccessory.id, {
					name: selectedAccessory.name,
					quantity: selectedAccessory.quantity,
					price: selectedAccessory.price,
					image: newImage || undefined,
				});

				showNotification({
					title: 'Успешно',
					message: 'Аксессуар обновлён',
					color: 'green',
					icon: <IconCheck />,
				});
			}
			setEditModalOpened(false);
			loadAccessories();
		} catch (error) {
			showNotification({
				title: 'Ошибка',
				message: 'Ошибка при сохранении аксессуара',
				color: 'red',
				icon: <IconX />,
			});
		}
	};

	const handleCreate = async () => {
		if (!newAccessory?.name) return;

		try {
			await createAccessory({
				name: newAccessory.name,
				quantity: newAccessory.quantity,
				price: newAccessory.price,
				image: newImage || undefined,
			});

			showNotification({
				title: 'Успешно',
				message: 'Аксессуар создан',
				color: 'green',
				icon: <IconCheck />,
			});

			setAddModalOpened(false);
			loadAccessories();
		} catch (error) {
			showNotification({
				title: 'Ошибка',
				message: 'Ошибка при создании аксессуара',
				color: 'red',
				icon: <IconX />,
			});
		}
	};


	const handleDeleteConfirm = () => {
		setDeleteModalOpened(true);
	};

	const handleDelete = async () => {
		try {
			if (selectedAccessory?.id) {
				await deleteAccessory(selectedAccessory.id);

				showNotification({
					title: 'Удалено',
					message: 'Аксессуар успешно удалён',
					color: 'green',
					icon: <IconCheck />,
				});
			}

			setEditModalOpened(false);
			setDeleteModalOpened(false);
			loadAccessories();
		} catch (error) {
			showNotification({
				title: 'Ошибка',
				message: 'Ошибка при удалении аксессуара',
				color: 'red',
				icon: <IconX />,
			});
		}
	};

	if (loading) return 
		<LoadingOverlay
			visible
			overlayProps={{ radius: 'sm', blur: 2 }}
			loaderProps={{ color: 'blue.5', type: 'bars' }}
		/>;

	return (
		<Container id="accessories" py="xl" size="lg">
			<Group justify="space-between" mb="xl">
				<Title fz={45}>Управление аксессуарами</Title>
				<Button
					variant="outline"
					radius="xl"
					leftSection={<IconPlus size={18} />}
					onClick={handleAddClick}
				>
					Добавить аксессуар
				</Button>
			</Group>

			<SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} spacing="sm">
				{accessories.map((accessory) => (
					<div key={accessory.id} onClick={() => handleCardClick(accessory)} style={{ cursor: 'pointer' }}>
						<AccessoryCard accessory={accessory} showQuantity={true} />
					</div>
				))}
			</SimpleGrid>

			{/* Модальное окно редактирования */}
			<Modal
				opened={editModalOpened}
				onClose={() => { setEditModalOpened(false); setNewImage(null); }}
				title={`Редактирование: ${selectedAccessory?.name || ''}`}
				size="lg"
				radius="xl"
				centered
			>
				{selectedAccessory && (
					<Stack gap="md">
						{/* Превью */}
						<Box>
							<Text size="sm" fw={500} mb="xs">Изображение:</Text>

							{newImage || (selectedAccessory?.image_url || newAccessory?.image_url) ? (
								<Image
									src={
										newImage
											? URL.createObjectURL(newImage)
											: `${BASE_IMAGE_URL}${selectedAccessory?.image_url || newAccessory?.image_url}`
									}
									alt={selectedAccessory?.name || newAccessory?.name || 'Изображение аксессуара'}
									height={160}
									fit="contain"
									style={{ border: '1px solid #dee2e6', borderRadius: 'var(--mantine-radius-lg)' }}
								/>
							) : (
								<Box
									h={160}
									style={{
										border: '1px dashed #ccc',
										borderRadius: 'var(--mantine-radius-lg)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										backgroundColor: '#f8f9fa',
										color: '#999',
										fontStyle: 'italic',
									}}
								>
									Нет изображения
								</Box>
							)}
						</Box>


						{/* FileInput */}
						<FileInput
							label="Загрузить изображение"
							radius="md"
							accept="image/*"
							onChange={setNewImage}
							placeholder={selectedAccessory.image_url ? `${BASE_IMAGE_URL}${selectedAccessory.image_url}` : "Выберите файл"}
						/>
						<Text size="xs" c="dimmed">Рекомендуемый размер: 1000x800</Text>

						{/* Текстовые поля */}
						<TextInput
							label="Название"
							value={selectedAccessory.name}
							radius="md"
							onChange={(e) => setSelectedAccessory({
								...selectedAccessory,
								name: e.target.value
							})}
						/>

						<NumberInput
							label="Количество"
							value={selectedAccessory.quantity}
							radius="md"
							onChange={(value) => setSelectedAccessory({
								...selectedAccessory,
								quantity: Number(value)
							})}
						/>

						{/* Кнопки */}
						<Flex justify="space-between" mt="md">
							<Button
								color="red"
								variant="outline"
								onClick={handleDeleteConfirm}
								radius="md"
							>
								Удалить аксессуар
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
				onClose={() => { setDeleteModalOpened(false); setNewImage(null); }}
				title="Подтверждение удаления"
				size="md"
				radius="xl"
				centered
			>
				<Stack>
					<Text>Вы уверены, что хотите удалить "{selectedAccessory?.name}"?</Text>
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
				title="Добавление нового аксессуара"
				size="lg"
				radius="xl"
				centered
			>
				<Stack gap="md">
					{/* Превью */}
					<Box>
						<Text size="sm" fw={500} mb="xs">Изображение:</Text>

						{newImage || newAccessory?.image_url ? (
							<Image
								src={
									newImage
										? URL.createObjectURL(newImage)
										: `${BASE_IMAGE_URL}${selectedAccessory?.image_url || newAccessory?.image_url}`
								}
								alt={selectedAccessory?.name || newAccessory?.name || 'Изображение аксессуара'}
								height={160}
								fit="contain"
								style={{ border: '1px solid #dee2e6', borderRadius: 'var(--mantine-radius-lg)' }}
							/>
						) : (
							<Box
								h={160}
								style={{
									border: '1px dashed #ccc',
									borderRadius: 'var(--mantine-radius-lg)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									backgroundColor: '#f8f9fa',
									color: '#999',
									fontStyle: 'italic',
								}}
							>
								Нет изображения
							</Box>
						)}
					</Box>


					{/* FileInput */}
					<FileInput
						label="Загрузить изображение"
						radius="md"
						accept="image/*"
						onChange={setNewImage}
						placeholder={newAccessory?.image_url ? `${BASE_IMAGE_URL}${newAccessory.image_url}` : "Выберите файл"}
					/>
					<Text size="xs" c="dimmed">Рекомендуемый размер: 1000x800</Text>

					{/* Текстовые поля */}
					<TextInput
						radius="md"
						label="Название"
						placeholder="Введите название"
						value={newAccessory?.name || ''}
						onChange={(e) => setNewAccessory({
							...newAccessory,
							name: e.target.value
						})}
					/>

					<NumberInput
						label="Количество"
						radius="md"
						value={newAccessory?.quantity || 0}
						onChange={(value) => setNewAccessory({
							...newAccessory,
							quantity: Number(value),
							available_quantity: Number(value)
						})}
						min={0}
					/>

					{/* Кнопки */}
					<Group justify="flex-end" mt="md">
						<Button radius="md" variant="outline" onClick={() => setAddModalOpened(false)}>
							Отмена
						</Button>
						<Button radius="md" onClick={handleCreate} disabled={!newAccessory?.name}>
							Создать аксессуар
						</Button>
					</Group>
				</Stack>
			</Modal>

		</Container>
	);
}
