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
	ScrollArea,
	SimpleGrid,
	Stack,
	Switch,
	Text,
	TextInput,
	Title
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
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

	const [saving, setSaving] = useState(false); // для блокировки кнопок сохранения/создания
	const isMobile = useMediaQuery("(max-width: 576px)");

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
		});
		setNewImage(null);
		setImagePreview(null);
		setAddModalOpened(true);
	};

	const handleDeleteClick = (bike: Bike) => {
		setSelectedBike(bike);
		setDeleteModalOpened(true);
	};

	const handleDelete = async () => {
		if (!selectedBike?.id) return;
		setSaving(true);
		try {
			await deleteBike(selectedBike.id);
			setDeleteModalOpened(false);
			setSelectedBike(null);
			loadBikes();
		} catch (error) {
			console.error("Ошибка удаления:", error);
		} finally {
			setSaving(false);
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
			"wheel_size",
			"day_price",
			"quantity",
		];

		// charge_time_hours - строка, оставляем как есть

		if (numericKeys.includes(key)) {
			if (value === "" || value === undefined || value === null) {
				return { ...bike, [key]: 0 };
			}
			if (typeof value === "string") {
				const n = Number(value);
				return { ...bike, [key]: isNaN(n) ? 0 : n };
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
		} else {
			setImagePreview(null);
		}
	};

	const renderBikeFields = (
		bike: Partial<Bike>,
		setBike: (bike: Partial<Bike>) => void
	) => (
		<ScrollArea h={600} type="auto">
			<Stack gap="sm" p="sm">
				<TextInput
					label="Название"
					placeholder="Например, Kirin V3 Pro"
					value={bike.name ?? ""}
					onChange={(e) => setBike(updateBikeField(bike, "name", e.target.value))}
					radius="md"
					required
				/>
				<NumberInput
					label="Вес (кг)"
					value={bike.weight ?? 0}
					onChange={(v) => setBike(updateBikeField(bike, "weight", v))}
					radius="md"
					min={0}
				/>
				<NumberInput
					label="Макс. скорость (км/ч)"
					value={bike.max_speed ?? 0}
					onChange={(v) => setBike(updateBikeField(bike, "max_speed", v))}
					radius="md"
					min={0}
				/>
				<NumberInput
					label="Макс. пробег (км)"
					value={bike.max_range ?? 0}
					onChange={(v) => setBike(updateBikeField(bike, "max_range", v))}
					radius="md"
					min={0}
				/>
				<NumberInput
					label="Макс. нагрузка (кг)"
					value={bike.max_load ?? 0}
					onChange={(v) => setBike(updateBikeField(bike, "max_load", v))}
					radius="md"
					min={0}
				/>
				<NumberInput
					label="Мощность (Вт)"
					value={bike.power ?? 0}
					onChange={(v) => setBike(updateBikeField(bike, "power", v))}
					radius="md"
					min={0}
				/>
				<TextInput
					label="Время зарядки (ч)"
					placeholder="Например, 7-8"
					value={bike.charge_time_hours ?? ""}
					onChange={(e) => setBike(updateBikeField(bike, "charge_time_hours", e.target.value))}
					radius="md"
				/>
				<TextInput
					label="Батарея"
					placeholder="Например, съемная, литиевая, 21Ah"
					value={bike.battery ?? ""}
					onChange={(e) => setBike(updateBikeField(bike, "battery", e.target.value))}
					radius="md"
				/>

				<Text fw={500} size="sm">Наличие амортизации</Text>
				<Switch
					label="Подвеска"
					checked={bike.suspension ?? false}
					onChange={(e) => setBike(updateBikeField(bike, "suspension", e.currentTarget.checked))}
				/>
				<TextInput
					label="Тормоза"
					placeholder="Например, задний гидравлический тормоз"
					value={bike.brakes ?? ""}
					onChange={(e) => setBike(updateBikeField(bike, "brakes",
						e.target.value))}
					radius="md"
				/>
				<TextInput
					label="Рама"
					placeholder="Например, алюминий"
					value={bike.frame ?? ""}
					onChange={(e) => setBike(updateBikeField(bike, "frame", e.target.value))}
					radius="md"
				/>
				<NumberInput
					label="Размер колеса (дюймы)"
					value={bike.wheel_size ?? 0}
					onChange={(v) => setBike(updateBikeField(bike, "wheel_size", v))}
					radius="md"
					min={0}
				/>
				<TextInput
					label="Тип колеса"
					placeholder="Например, надувные"
					value={bike.wheel_type ?? ""}
					onChange={(e) => setBike(updateBikeField(bike, "wheel_type", e.target.value))}
					radius="md"
				/>
				<TextInput
					label="Привод"
					placeholder="Например, задний"
					value={bike.drive ?? ""}
					onChange={(e) => setBike(updateBikeField(bike, "drive", e.target.value))}
					radius="md"
				/>
				<TextInput
					label="Тормозная система"
					placeholder="Например, гидравлический"
					value={bike.brake_system ?? ""}
					onChange={(e) => setBike(updateBikeField(bike, "brake_system", e.target.value))}
					radius="md"
				/>
				<NumberInput
					label="Цена за день (в копейках, ₽)"
					value={bike.day_price ?? 0}
					onChange={(v) => setBike(updateBikeField(bike, "day_price", v))}
					radius="md"
					min={0}
				/>
				<NumberInput
					label="Количество"
					value={bike.quantity ?? 1}
					onChange={(v) => setBike(updateBikeField(bike, "quantity", v))}
					radius="md"
					min={1}
				/>
			</Stack>
		</ScrollArea>
	);


	return (
		<Container size="lg" py="md">
			<Group justify="space-between" mb="xl">
				<Title mb="md" fz={{ base: "24px", xs: "32px", sm: "36px", lg: "45px", xxl: "60px" }}>Управление велосипедами</Title>
				<Button
					variant="outline"
					radius="xl"
					leftSection={<IconPlus size={18} />}
					onClick={handleAddClick}
				>
					Добавить велосипед
				</Button>
			</Group>
			<LoadingOverlay
				visible={loading}
				overlayProps={{ radius: 'sm', blur: 2 }}
				loaderProps={{ color: 'blue.5', type: 'bars' }}
			/>
			<SimpleGrid cols={{ base: 1, sm: 1, md: 1 }} spacing="lg">
				{bikes.map((bike) => (
					<AdminBikeCard
						key={bike.id}
						bike={bike}
						onEdit={() => handleEditClick(bike)}
						onDelete={() => handleDeleteClick(bike)}
					/>
				))}
			</SimpleGrid>

			<Modal
				opened={addModalOpened}
				fullScreen={isMobile}
				onClose={() => {
					setAddModalOpened(false);
					setNewBike(null);
					setNewImage(null);
					setImagePreview(null);
				}}
				title="Добавить велосипед"
				size="xl"
				centered
			>
				<Flex gap="lg" align="start" direction={isMobile ? "column" : "row"}>
					<Stack px="sm" w={{ base: "100%", sm:240}} align="center" gap="sm">
						{imagePreview ? (
							<Image
								src={imagePreview.startsWith('data:') || imagePreview.startsWith('http')
									? imagePreview
									: `${BASE_IMAGE_URL}/${imagePreview}`}
								h={160}
								fit="contain"
							/>
						) : (
							<Group h={200} w={{ base: "100%", sm: 200}} bg="gray.1" justify="center" align="center" style={{ borderRadius: 8 }}>
								<IconPhoto size={48} color="gray" />
							</Group>
						)}
						<FileInput
							placeholder={newImage?.name || "Выберите изображение"}
							rightSection={<IconPhoto size={20} />}
							value={newImage}
							radius="md"
							onChange={(file) => {
								handleImageChange(file);
								setNewImage(file);
								if (file) setImagePreview(URL.createObjectURL(file));
								else setImagePreview(null);
							}}
							w="100%"
						/>
					</Stack>

					<Box style={{ flex: 1 }}  w="100%">
						{newBike && renderBikeFields(newBike, setNewBike)}
						<Group justify="flex-end" mt="md">
							<Button
								onClick={async () => {
									if (!newBike) return;
									setSaving(true);
									try {
										await createBike({ ...newBike, image: newImage || undefined });
										setAddModalOpened(false);
										setNewBike(null);
										setNewImage(null);
										setImagePreview(null);
										loadBikes();
									} catch (e) {
										console.error("Ошибка при создании:", e);
									} finally {
										setSaving(false);
									}
								}}
								loading={saving}
							>
								Создать
							</Button>
						</Group>
					</Box>
				</Flex>
			</Modal>


			<Modal
				opened={editModalOpened}
				fullScreen={isMobile}
				onClose={() => {
					setEditModalOpened(false);
					setSelectedBike(null);
					setNewImage(null);
					setImagePreview(null);
				}}
				title="Редактировать велосипед"
				size="xl"
				centered
			>
				<Flex gap="lg" align="start" direction={isMobile ? "column" : "row"}>
					<Stack px="sm" w={{base: "100%", sm: 240}} align="center" gap="sm">
						{imagePreview ? (
							<Image
								src={imagePreview.startsWith('data:')
									? imagePreview
									: `${BASE_IMAGE_URL}/${imagePreview}`}
								h={{base: "100%", sm: 200}} w={{base: "100%", sm: 200}}
								fit="contain"
							/>
						) : (
							<Group h={{base: "100%", sm: 200}} w={{base: "100%", sm: 200}} bg="gray.1" justify="center" align="center" style={{ borderRadius: 8 }}>
								<IconPhoto size={48} color="gray" />
							</Group>
						)}
						<FileInput
							placeholder={newImage?.name || selectedBike?.image_url || "Выберите изображение"}
							rightSection={<IconPhoto size="20" />}
							value={newImage}
							radius="md"
							onChange={(file) => {
								handleImageChange(file);
								setNewImage(file);
								if (file) setImagePreview(URL.createObjectURL(file));
								else setImagePreview(null);
							}}
							w="100%"
						/>
					</Stack>

					<Box style={{ flex: 1 }} w="100%">
						{selectedBike && renderBikeFields(selectedBike, (b) => setSelectedBike(b as Bike))}
						<Group justify="space-between" mt="md">
							<Button
								variant="outline"
								color="red"
								leftSection={<IconTrash size={16} />}
								onClick={async () => {
									if (!selectedBike?.id) return;
									setSaving(true);
									try {
										await deleteBike(selectedBike.id);
										setEditModalOpened(false);
										setSelectedBike(null);
										setNewImage(null);
										setImagePreview(null);
										loadBikes();
									} catch (error) {
										console.error("Ошибка при удалении:", error);
									} finally {
										setSaving(false);
									}
								}}
								disabled={saving}
							>
								Удалить
							</Button>

							<Button
								onClick={async () => {
									if (!selectedBike?.id) return;
									setSaving(true);
									try {
										await updateBike(selectedBike.id, {
											...selectedBike,
											image: newImage || undefined,
										});
										setEditModalOpened(false);
										setSelectedBike(null);
										setNewImage(null);
										setImagePreview(null);
										loadBikes();
									} catch (error) {
										console.error("Ошибка при сохранении:", error);
									} finally {
										setSaving(false);
									}
								}}
								loading={saving}
							>
								Сохранить
							</Button>
						</Group>
					</Box>
				</Flex>
			</Modal>



			<Modal opened={deleteModalOpened} onClose={() => setDeleteModalOpened(false)} title="Удалить велосипед?" centered>
				<Text>Вы уверены, что хотите удалить {selectedBike?.name}?</Text>
				<Flex justify="flex-end" gap="md" mt="md">
					<Button variant="default" onClick={() => setDeleteModalOpened(false)}>Отмена</Button>
					<Button color="red" leftSection={<IconTrash />} loading={saving} onClick={handleDelete}>
						Удалить
					</Button>
				</Flex>
			</Modal>
		</Container>
	);
}