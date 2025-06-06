// src/components/Admin/AdminAllBikes.tsx

import {
	Button,
	Card,
	Container,
	FileInput,
	Flex,
	Group,
	Image,
	LoadingOverlay,
	Modal,
	NumberInput,
	rem,
	ScrollArea,
	SimpleGrid,
	Stack,
	Switch,
	Text,
	TextInput,
	Title,
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
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	useEffect(() => {
		loadBikes();
	}, []);

	const loadBikes = () => {
		setLoading(true);
		getAllBikes()
			.then(([fetchedBikes]) => setBikes(fetchedBikes))
			.catch((error) => console.error("Ошибка загрузки:", error))
			.finally(() => setLoading(false));
	};

	const handleEditClick = (bike: Bike) => {
		setSelectedBike({ ...bike });
		setNewImage(null);
		setImagePreview(bike.image_url || null);
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
			charge_time_hours: '',
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
			available_quantity: 1,
		});
		setNewImage(null);
		setImagePreview(null);
		setAddModalOpened(true);
	};

	const handleDeleteClick = (bike: Bike) => {
		setSelectedBike(bike);
		setDeleteModalOpened(true);
	};

	const handleCreate = async () => {
	if (!newBike?.name) return;

	try {
		await createBike({
			...newBike,
			image: newImage || undefined,
		});
		setAddModalOpened(false);
		setNewBike(null);
		setNewImage(null);
		setImagePreview(null);
		loadBikes();
	} catch (error) {
		console.error("Ошибка создания:", error);
	}
};


	const handleDelete = async () => {
		try {
			if (selectedBike?.id !== undefined) {
				await deleteBike(selectedBike.id);
			}
			setDeleteModalOpened(false);
			setSelectedBike(null);
			loadBikes();
		} catch (error) {
			console.error("Ошибка удаления:", error);
		}
	};

	const updateBikeField = <K extends keyof Bike>(
		bike: Partial<Bike>,
		key: K,
		value: string | number | boolean | undefined
	): Partial<Bike> => {
		const numericKeys: (keyof Bike)[] = [
			"weight",
			"max_speed",
			"max_range",
			"max_load",
			"power",
			"charge_time_hours",
			"wheel_size",
			"day_price",
			"quantity",
			"available_quantity",
		];

		if (numericKeys.includes(key)) {
			if (typeof value === "string") {
				return { ...bike, [key]: value === "" ? 0 : Number(value) };
			}
			if (typeof value === "number") {
				return { ...bike, [key]: value };
			}
			return { ...bike, [key]: 0 };
		}

		if (typeof value === "boolean") {
			return { ...bike, [key]: value };
		}

		return { ...bike, [key]: value };
	};

	const handleImageChange = (file: File | null) => {
		setNewImage(file);
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setImagePreview(e.target?.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const renderBikeFields = (
		bike: Partial<Bike>,
		setBike: (bike: Partial<Bike>) => void
	) => (
		<ScrollArea h={600} type="auto">
			<Stack gap="sm" p="sm">
				<TextInput label="Название" value={bike.name ?? ""} onChange={(e) => setBike(updateBikeField(bike, "name", e.target.value))} radius="md" />
				<NumberInput label="Вес (кг)" value={bike.weight} onChange={(v) => setBike(updateBikeField(bike, "weight", v))} radius="md" />
				<NumberInput label="Макс. скорость (км/ч)" value={bike.max_speed} onChange={(v) => setBike(updateBikeField(bike, "max_speed", v))} radius="md" />
				<NumberInput label="Макс. пробег (км)" value={bike.max_range} onChange={(v) => setBike(updateBikeField(bike, "max_range", v))} radius="md" />
				<NumberInput label="Макс. нагрузка (кг)" value={bike.max_load} onChange={(v) => setBike(updateBikeField(bike, "max_load", v))} radius="md" />
				<NumberInput label="Мощность (Вт)" value={bike.power} onChange={(v) => setBike(updateBikeField(bike, "power", v))} radius="md" />
				<TextInput label="Время зарядки (ч)" value={bike.charge_time_hours} onChange={(e) => setBike(updateBikeField(bike, "charge_time_hours", e.target.value))} radius="md" />
				<TextInput label="Батарея" value={bike.battery ?? ""} onChange={(e) => setBike(updateBikeField(bike, "battery", e.target.value))} radius="md" />
				<Switch label="Подвеска" checked={bike.suspension ?? false} onChange={(e) => setBike(updateBikeField(bike, "suspension", e.currentTarget.checked))} />
				<TextInput label="Тормоза" value={bike.brakes ?? ""} onChange={(e) => setBike(updateBikeField(bike, "brakes", e.target.value))} radius="md" />
				<TextInput label="Рама" value={bike.frame ?? ""} onChange={(e) => setBike(updateBikeField(bike, "frame", e.target.value))} radius="md" />
				<NumberInput label="Размер колеса (дюймы)" value={bike.wheel_size} onChange={(v) => setBike(updateBikeField(bike, "wheel_size", v))} radius="md" />
				<TextInput label="Тип колеса" value={bike.wheel_type ?? ""} onChange={(e) => setBike(updateBikeField(bike, "wheel_type", e.target.value))} radius="md" />
				<TextInput label="Привод" value={bike.drive ?? ""} onChange={(e) => setBike(updateBikeField(bike, "drive", e.target.value))} radius="md" />
				<TextInput label="Тормозная система" value={bike.brake_system ?? ""} onChange={(e) => setBike(updateBikeField(bike, "brake_system", e.target.value))} radius="md" />
				<NumberInput label="Цена за день (₽)" value={bike.day_price} onChange={(v) => setBike(updateBikeField(bike, "day_price", v))} radius="md" />
				<NumberInput label="Всего в наличии" value={bike.quantity} onChange={(v) => setBike(updateBikeField(bike, "quantity", v))} radius="md" />
			</Stack>
		</ScrollArea>
	);

	const handleSave = async () => {
	try {
		if (selectedBike) {
			await updateBike(selectedBike.id, {
				...selectedBike,
				image: newImage || undefined,
			});
		}
		setEditModalOpened(false);
		setSelectedBike(null);
		setNewImage(null);
		setImagePreview(null);
		loadBikes();
	} catch (error) {
		console.error("Ошибка сохранения:", error);
	}
};


	const renderModalContent = (
		bike: Partial<Bike>,
		setBike: (bike: Partial<Bike>) => void,
	) => (
		<SimpleGrid cols={2} spacing="xl">
			<Stack>
				<Card withBorder radius="md">
					{imagePreview ? (
						<Image
							src={imagePreview.startsWith("data:") ? imagePreview : BASE_IMAGE_URL + imagePreview}
							alt={bike.name || "Превью велосипеда"}
							radius="md"
							fit="contain"
							style={{ maxHeight: rem(400) }}
						/>
					) : (
						<Stack align="center" justify="center" h="100%" c="dimmed">
							<IconPhoto size={80} stroke={1.5} />
							<Text size="lg">Изображение отсутствует</Text>
						</Stack>
					)}
				</Card>
				<FileInput
					label="Загрузить изображение"
					accept="image/*"
					onChange={handleImageChange}
					placeholder="Выберите файл"
					leftSection={<IconPhoto size={18} />}
					radius="md"
				/>
			</Stack>
			{renderBikeFields(bike, setBike)}
		</SimpleGrid>
	);

	const renderModalActions = (bike: Partial<Bike>, isEdit: boolean) => (
		<Flex justify="space-between" mt="md">
			{isEdit && (
				<Button color="red" variant="outline" leftSection={<IconTrash size={16} />} onClick={() => {
					setEditModalOpened(false);
					setDeleteModalOpened(true);
				}}>
					Удалить
				</Button>
			)}
			<Group justify="flex-end">
				<Button variant="outline" onClick={() => {
					isEdit ? setEditModalOpened(false) : setAddModalOpened(false);
					setNewImage(null);
					setImagePreview(null);
				}}>
					Отмена
				</Button>
				<Button
					onClick={isEdit ? handleSave : handleCreate}
					leftSection={isEdit ? null : <IconPlus size={16} />}
					disabled={!bike.name}
				>
					{isEdit ? "Сохранить изменения" : "Создать велосипед"}
				</Button>
			</Group>
		</Flex>
	);

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

			{/* Modal: Edit */}
			<Modal
				opened={editModalOpened}
				onClose={() => {
					setEditModalOpened(false);
					setNewImage(null);
					setImagePreview(null);
				}}
				title={`Редактирование: ${selectedBike?.name || ""}`}
				size="xl"
				radius="xl"
				centered
			>
				{selectedBike && (
					<>
						{renderModalContent(
							selectedBike,
							(updated) => setSelectedBike((prev) => ({ ...(prev || {}), ...updated } as Bike))
						)}
						{renderModalActions(selectedBike, true)}
					</>
				)}
			</Modal>

			{/* Modal: Delete */}
			<Modal
				opened={deleteModalOpened}
				onClose={() => setDeleteModalOpened(false)}
				title="Подтверждение удаления"
				size="md"
				radius="xl"
				centered
			>
				<Stack>
					<Text>Вы уверены, что хотите удалить «{selectedBike?.name}»?</Text>
					<Text size="sm" c="dimmed">Это действие нельзя отменить.</Text>
					<Group justify="flex-end">
						<Button variant="outline" onClick={() => setDeleteModalOpened(false)}>Отмена</Button>
						<Button color="red" onClick={handleDelete} leftSection={<IconTrash size={16} />}>
							Удалить
						</Button>
					</Group>
				</Stack>
			</Modal>

			{/* Modal: Add */}
			<Modal
				opened={addModalOpened}
				onClose={() => {
					setAddModalOpened(false);
					setNewImage(null);
					setImagePreview(null);
				}}
				title="Добавление нового велосипеда"
				size="xl"
				radius="xl"
				centered
			>
				{newBike && (
					<>
						{renderModalContent(
							newBike,
							(updated) => setNewBike((prev) => ({ ...(prev || {}), ...updated }))
						)}
						{renderModalActions(newBike, false)}
					</>
				)}
			</Modal>
		</Container>
	);
}
