import {
	Avatar,
	Button,
	Card,
	Container,
	Divider,
	Group,
	HoverCard,
	LoadingOverlay,
	Modal,
	NumberInput,
	Pill,
	Popover,
	SegmentedControl,
	Select,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconDotsVertical, IconPhoneCall } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllRents, updateRent } from "../../services/rentService";
import type { Rent, UpdateRentRequest } from "../../types/rent";
import AccessorySelectCardList from "../Accessory/AccessorySelectCardList";

export default function AdminRentRequests() {
	const [rents, setRents] = useState<Rent[]>([]);
	const [statusFilter, setStatusFilter] = useState("в обработке");
	const [selectedRent, setSelectedRent] = useState<Rent | null>(null);
	const [loadingRents, setLoadingRents] = useState(false);
	const [openedPopoverId, setOpenedPopoverId] = useState<number | null>(null);
	const [modalOpened, setModalOpened] = useState(false);

	const refreshRents = async () => {
		setLoadingRents(true);
		try {
			const data = await getAllRents();
			setRents(data);
		} catch (error) {
			showNotification({
				title: 'Ошибка',
				message: 'Не удалось загрузить аренды',
				color: 'red',
			});
		} finally {
			setLoadingRents(false);
		}
	};

	useEffect(() => {
		refreshRents();
	}, []);

	const filtered = rents.filter((r) => {
		if (statusFilter === "done") {
			return ["завершена"].includes(r.status);
		}
		return r.status === statusFilter;
	});

	const handleActions = (
		id: number,
		status: string,
		onClose: () => void
	) => {
		const actions: React.ReactNode[] = [];

		if (status === 'в обработке') {
			actions.push(
				<Button
					fullWidth
					color="green"
					onClick={() => { handleAccept(id); onClose(); }}
					radius="md"
				>
					Подтвердить
				</Button>,
				<Button
					fullWidth
					variant="default"
					onClick={() => { handleReject(id); onClose(); }}
					radius="md"
				>
					Отказать
				</Button>
			);
		} else if (status === 'арендован') {
			actions.push(
				<Button
					fullWidth
					color="blue"
					onClick={() => { handleComplete(id); onClose(); }}
					radius="md"
				>
					Завершить аренду
				</Button>,
				<Button
					fullWidth
					variant="default"
					onClick={() => { handleExtend(id); onClose(); }}
					radius="md"
				>
					Продлить аренду
				</Button>
			);
		}

		return (
			<Stack p="xs" style={{ width: 200 }}>
				{actions.length > 0 ? actions : <Text size="sm" c="dimmed">Нет доступных действий</Text>}
			</Stack>
		);
	};

	const handleEditRent = (rent: Rent) => {
		let updateData: UpdateRentRequest = {
			startDate: rent.start_date,
			status: rent.status,
			accessories: rent.accessories.map(a => a.id)
		};

		modals.openConfirmModal({
			title: 'Редактировать аренду',
			size: 'lg',
			centered: true,
			closeOnConfirm: false,
			labels: { confirm: 'Сохранить', cancel: 'Отмена' },
			children: (
				<Stack>
					<DateInput
						label="Дата начала"
						placeholder="Выберите дату"
						valueFormat="YYYY-MM-DD"
						value={updateData.startDate ? new Date(updateData.startDate) : null}
						onChange={(date) => {
							if (date) {
								updateData.startDate = date.slice(0, 10);
							}
						}}
					/>

					<Select
						label="Статус"
						data={[
							{ value: 'в обработке', label: 'В обработке' },
							{ value: 'арендован', label: 'Арендован' },
							{ value: 'завершен', label: 'Завершен' },
							{ value: 'отказано', label: 'отказано' },
							{ value: 'аренда продлена', label: 'Аренда продлена' },
						]}
						value={updateData.status}
						onChange={(value) => (updateData.status = value || updateData.status)}
					/>

					<Text fw={600}>Выберите аксессуары</Text>
					<AccessorySelectCardList
						selectedAccessories={updateData.accessories || []}
						onChangeSelected={(ids) => {
							const resolvedIds = typeof ids === 'function' ? ids(updateData.accessories || []) : ids;
							updateData.accessories = resolvedIds;
						}}
					/>

				</Stack>
			),
			onConfirm: async () => {
				try {
					setLoadingRents(true);
					await updateRent(rent.id!, updateData);
					showNotification({
						title: 'Успешно',
						message: 'Аренда обновлена',
						color: 'green',
					});
					await refreshRents();
					modals.closeAll();
				} catch (error) {
					showNotification({
						title: 'Ошибка',
						message: 'Не удалось обновить аренду',
						color: 'red',
					});
				} finally {
					setLoadingRents(false);
				}
			},
		});
	};

	const handleAccept = async (rentId: number) => {
		modals.openConfirmModal({
			title: 'Подтвердить аренду',
			centered: true,
			children: (
				<Text size="sm">
					Вы уверены, что хотите подтвердить эту аренду? Статус будет изменён на <b>арендован</b>.
				</Text>
			),
			labels: { confirm: 'Подтвердить', cancel: 'Отмена' },
			confirmProps: { color: 'green' },
			onConfirm: async () => {
				setLoadingRents(true);
				try {
					await updateRent(rentId, {
						status: 'арендован',
					});
					showNotification({
						title: 'Успешно',
						message: 'Аренда подтверждена',
						color: 'green',
					});
					await refreshRents();
					modals.closeAll();
				} catch (error) {
					showNotification({
						title: 'Ошибка',
						message: 'Не удалось подтвердить аренду',
						color: 'red',
					});
				} finally {
					setLoadingRents(false);
				}
			},
		});
	};

	const handleReject = async (rentId: number) => {
		modals.openConfirmModal({
			title: 'Подтвердите отказ от аренды',
			labels: { confirm: 'Отказать', cancel: 'Назад' },
			confirmProps: { color: 'red' },
			centered: true,
			children: (
				<Text size="sm">
					Вы уверены, что хотите <b>отклонить</b> аренду #{rentId}? Это действие нельзя отменить.
				</Text>
			),
			onConfirm: async () => {
				setLoadingRents(true);
				try {
					await updateRent(rentId, {
						status: 'отказано',
					});
					await refreshRents();
					showNotification({
						title: 'Успешно',
						message: 'Аренда отклонена',
						color: 'green',
					});
					modals.closeAll();
				} catch (error) {
					showNotification({
						title: 'Ошибка',
						message: 'Ошибка при отказе от аренды',
						color: 'red',
					});
					modals.closeAll();
				} finally {
					setLoadingRents(false);
				}
			},
		});
	};

	const handleComplete = async (rentId: number) => {
		modals.openConfirmModal({
			title: 'Завершить аренду',
			centered: true,
			children: (
				<Text size="sm">
					Вы уверены, что хотите завершить эту аренду? Статус будет изменён на <b>завершена</b>.
				</Text>
			),
			labels: { confirm: 'Завершить', cancel: 'Отмена' },
			confirmProps: { color: 'teal' },
			onConfirm: async () => {
				setLoadingRents(true);
				try {
					await updateRent(rentId, {
						status: 'завершена',
					});
					showNotification({
						title: 'Успешно',
						message: 'Аренда завершена',
						color: 'teal',
					});
					await refreshRents();
					modals.closeAll();
				} catch (error) {
					showNotification({
						title: 'Ошибка',
						message: 'Не удалось завершить аренду',
						color: 'red',
					});
				} finally {
					setLoadingRents(false);
				}
			},
		});
	};

	const handleExtend = async (rentId: number) => {
		let days = 1;

		modals.openConfirmModal({
			title: 'Продлить аренду',
			labels: { confirm: 'Продлить', cancel: 'Отмена' },
			closeOnConfirm: false,
			centered: true,
			children: (
				<NumberInput
					label="Количество дней продления"
					defaultValue={1}
					min={1}
					max={30}
					onChange={(val) => days = Number(val)}
				/>
			),
			onConfirm: async () => {
				setLoadingRents(true);
				try {
					await updateRent(rentId, {
						status: 'аренда продлена',
						rentalDays: days,
					} as UpdateRentRequest);
					showNotification({
						title: 'Успешно',
						message: 'Аренда продлена',
						color: 'green',
					});
					await refreshRents();
					modals.closeAll();
				} catch (error) {
					showNotification({
						title: 'Ошибка',
						message: 'Не удалось продлить аренду',
						color: 'red',
					});
				} finally {
					setLoadingRents(false);
				}
			},
		});
	};

	const handleDetails = (rent: Rent) => {
		setSelectedRent(rent);
		setModalOpened(true);
	};

	return (
		<Container size="lg" mb={80}>
			<Stack gap="md">
				<Title order={2}>Запросы на аренду</Title>

				<SegmentedControl
					fullWidth
					radius="xl"
					size="md"
					color="blue.7"
					value={statusFilter}
					onChange={setStatusFilter}
					data={[
						{ label: 'Ожидают подтверждения', value: 'в обработке' },
						{ label: 'Активные аренды', value: 'арендован' },
						{ label: 'Завершенные', value: 'done' },
					]}
				/>

				<Stack pos="relative">
					<LoadingOverlay
						visible={loadingRents}
						overlayProps={{ radius: 'sm', blur: 2 }}
						loaderProps={{ color: 'blue.5', type: 'bars' }}
					/>
					{filtered.length === 0 ? (
						<Text c="dimmed">Нет запросов для отображения.</Text>
					) : (
						filtered.map((r) => (
							<Card withBorder radius="xl" key={r.id} shadow="sm" h={265} p="xl">
								<Group align="start" gap="xl" justify="space-between" wrap="nowrap" style={{ width: '100%' }}>
									{/* Левый столбец */}
									<Stack gap={4} w={200} align="center" style={{ height: '100%' }}>
										<HoverCard width={260} shadow="md" withArrow position="right-start">
											<HoverCard.Target>
												<Group gap="sm" justify="center" style={{ cursor: 'pointer' }}>
													<Avatar
														size={80}
														name={`${r.user?.first_name} ${r.user?.last_name}`}
														radius={9999}
													/>
													<Text fw={700} fz="xl" style={{ whiteSpace: 'nowrap' }}>
														{r.user?.last_name} {r.user?.first_name?.[0]}.{r.user?.patronymic?.[0] || ''}.
													</Text>
												</Group>
											</HoverCard.Target>

											<HoverCard.Dropdown>
												<Stack gap={4}>
													<Text size="sm" fw={500}>{r.user?.last_name} {r.user?.first_name} {r.user?.patronymic} </Text>
													<Text size="sm">📧 Почта: {r.user?.email}</Text>
													<Text size="sm">
														🎂 Дата рождения: {r.user?.birthday && dayjs(r.user.birthday).format('DD.MM.YYYY')} (
														{r.user?.birthday && dayjs().diff(r.user.birthday, 'year')} лет)
													</Text>
													<Button
														variant="light"
														color="gray"
														size="xs"
														radius="md"
														fullWidth
														component={Link}
														to={`tel:${r.user?.phone_number}`}
														leftSection={<IconPhoneCall size={14} />}
													>
														Позвонить
													</Button>
												</Stack>
											</HoverCard.Dropdown>
										</HoverCard>

										<Text size="sm">Тел.: {r.user?.phone_number}</Text>
										<Button
											variant="light"
											color="gray"
											size="sm"
											mt="auto"
											radius="xl"
											fullWidth
											component={Link}
											to={`tel:${r.user?.phone_number}`}
											leftSection={<IconPhoneCall size={14} />}
										>
											Связаться с клиентом
										</Button>
									</Stack>

									<Divider orientation="vertical" />

									{/* Правый столбец */}
									{/* Правый столбец */}
									<Stack style={{ flexGrow: 1, height: '200px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
										{/* Заголовок на всю ширину */}
										<Stack style={{ gridColumn: '1 / -1' }}>
											<Text fz="28" lh={1.2} fw={700} lineClamp={1} title={r.bicycle.name}>
												{r.bicycle.name}
											</Text>
											<Text size="md" c="dimmed">
												Запрашиваемый период: {dayjs(r.start_date).format('DD.MM.YYYY')} - {dayjs(r.expire_date).format('DD.MM.YYYY')}
											</Text>
										</Stack>

										{/* Левая колонка */}
										<Stack gap={4}>
											<Text size="md" fw={500}>
												Стоимость аренды: {r.rent_price / 100} ₽
											</Text>
											{r.accessories.length > 0 && (
												<Text size="md" lineClamp={2} title={r.accessories.map(a => a.name).join(', ')}>
													Аксессуары: {r.accessories.map(a => a.name).join(', ')}
												</Text>
											)}
										</Stack>

										{/* Правая колонка */}
										<Stack gap={4} align="flex-start">
											<Text size="md" fw={500}>
												Аксессуары: {r.accessory_price / 100} ₽
											</Text>
											<Group align="center" gap={6}>
												<Text size="md" fw={700} title={r.status}>
													Текущий статус:
												</Text>
												<Pill c="blue">{r.status}</Pill>
											</Group>
											<Text size="md" fw={700}>
												Итого: {(r.rent_price / 100 + r.accessory_price / 100).toFixed(2)} ₽
											</Text>
										</Stack>

										{/* Кнопки действий — разместим на всю ширину снизу */}
										<Group gap="sm">
											<Button variant="default" size="sm" radius="md" onClick={() => handleDetails(r)}>
												Детали
											</Button>

											<Popover width={220} position="bottom-end" opened={openedPopoverId === r.id}>
												<Popover.Target>
													<Button
														variant="subtle"
														size="sm"
														radius="md"
														px={8}
														onClick={() =>
															setOpenedPopoverId((prev) => {
																if (typeof r.id === "undefined") return prev;
																return prev === r.id ? null : r.id;
															})
														}
													>
														<IconDotsVertical size={18} />
													</Button>
												</Popover.Target>
												<Popover.Dropdown
													style={{
														borderRadius: 'var(--mantine-radius-lg)',
														boxShadow: '0 6px 24px rgba(0, 0, 0, 0.35)',
														padding: 'var(--mantine-spacing-sm)',
													}}
												>
													{handleActions(r.id!, r.status, () => setOpenedPopoverId(null))}
												</Popover.Dropdown>
											</Popover>
										</Group>
									</Stack>

								</Group>
							</Card>
						))
					)}
				</Stack>
			</Stack >

			<Modal opened={modalOpened} onClose={() => setModalOpened(false)} size="lg" title="Детали аренды">
				{selectedRent && (
					<Stack>
						<Text size="sm"><b>ID:</b> {selectedRent.id}</Text>
						<Text size="sm"><b>Пользователь:</b> {selectedRent.user?.last_name} {selectedRent.user?.first_name}</Text>
						<Text size="sm"><b>Велосипед:</b> {selectedRent.bicycle.name}</Text>
						<Text size="sm"><b>Период аренды:</b> {dayjs(selectedRent.start_date).format('DD.MM.YYYY')} - {dayjs(selectedRent.expire_date).format('DD.MM.YYYY')}</Text>
						<Text size="sm"><b>Статус:</b> {selectedRent.status}</Text>
						<Text size="sm"><b>Стоимость:</b> {selectedRent.rent_price + selectedRent.accessory_price}₽</Text>
						{selectedRent.accessories.length > 0 && (
							<Text size="sm"><b>Аксессуары:</b> {selectedRent.accessories.map(a => a.name).join(', ')}</Text>
						)}

						<Group justify="flex-end" mt="md">
							<Button variant="default" onClick={() => setModalOpened(false)}>
								Закрыть
							</Button>
							<Button onClick={() => {
								setModalOpened(false);
								handleEditRent(selectedRent);
							}}>
								Редактировать
							</Button>
						</Group>
					</Stack>
				)}
			</Modal>
		</Container >
	);
}