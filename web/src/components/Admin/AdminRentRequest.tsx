import {
	Avatar,
	Badge,
	Box,
	Button,
	Card,
	Container,
	Divider,
	Group,
	HoverCard,
	Image,
	LoadingOverlay,
	Menu,
	Modal,
	NumberInput,
	Paper,
	Pill,
	ScrollArea,
	SegmentedControl,
	Select,
	SimpleGrid,
	Stack,
	Text,
	ThemeIcon,
	Title
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconBike, IconCalendar, IconCheck, IconCheckupList, IconDotsVertical, IconPhoneCall, IconRefresh, IconUser, IconX } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BASE_IMAGE_URL } from "../../constants";
import { companyService } from "../../services/companyService";
import { getAllRents, updateRent } from "../../services/rentService";
import type { Company } from "../../types/company";
import type { Rent, UpdateRentRequest } from "../../types/rent";
import AccessorySelectCardList from "../Accessory/AccessorySelectCardList";

export default function AdminRentRequests() {
	const [rents, setRents] = useState<Rent[]>([]);
	const [statusFilter, setStatusFilter] = useState("в обработке");
	const [selectedRent, setSelectedRent] = useState<Rent | null>(null);
	const [loadingRents, setLoadingRents] = useState(false);
	const [modalOpened, setModalOpened] = useState(false);
	const [updateData, setUpdateData] = useState<UpdateRentRequest | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingRent, setEditingRent] = useState<Rent | null>(null);
	const [companiesDict, setCompaniesDict] = useState<Record<number, Company>>({});

	useEffect(() => {
		const fetchCompanies = async () => {
			try {
				const data = await companyService.getAllCompanies();
				const dict = data.reduce((acc, company) => {
					acc[company.id] = company;
					return acc;
				}, {} as Record<number, Company>);
				setCompaniesDict(dict);
			} catch (err) {
				console.error("Ошибка загрузки компаний:", err);
			}
		};
		fetchCompanies();
	}, []);
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
			return ["завершен", "отказано"].includes(r.status);
		}
		if (statusFilter === "processing") {
			return ["арендован", "аренда продлена"].includes(r.status);
		}
		return r.status === statusFilter;
	});

	const handleActions = (
		id: number,
		status: string,
	): React.ReactNode => {
		const actions: React.ReactNode[] = [];

		if (status === 'в обработке') {
			actions.push(
				<Menu.Item
					key="accept"
					color="green"
					leftSection={<IconCheck size={16} />}
					onClick={() => {
						handleAccept(id);
					}}
				>
					Подтвердить
				</Menu.Item>,
				<Menu.Item
					key="reject"
					color="red"
					leftSection={<IconX size={16} />}
					onClick={() => {
						handleReject(id);
					}}
				>
					Отказать
				</Menu.Item>
			);
		} else if (status === 'арендован' || status === 'аренда продлена') {
			actions.push(
				<Menu.Item
					key="complete"
					color="blue"
					leftSection={<IconCheckupList size={16} />}
					onClick={() => {
						handleComplete(id);
					}}
				>
					Завершить аренду
				</Menu.Item>,
				<Menu.Item
					key="extend"
					color="orange"
					leftSection={<IconRefresh size={16} />}
					onClick={() => {
						handleExtend(id);
					}}
				>
					Продлить аренду
				</Menu.Item>
			);
		}

		if (actions.length === 0) {
			actions.push(
				<Menu.Item key="no-actions" disabled>
					<Text size="sm" c="dimmed">Нет доступных действий</Text>
				</Menu.Item>
			);
		}

		return actions;
	};


	const handleEditRent = (rent: Rent) => {
		setEditingRent(rent);
		setUpdateData({
			startDate: rent.start_date,
			status: rent.status,
			accessories: rent.accessories.map(a => a.id),
		});
		setIsModalOpen(true);
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
						status: 'завершен',
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
						{ label: 'Активные аренды', value: 'processing' },
						{ label: 'Завершенные', value: 'done' },
					]}
				/>

				<Stack pos="relative" gap="xl">
					<LoadingOverlay
						visible={loadingRents}
						overlayProps={{ radius: 'sm', blur: 2 }}
						loaderProps={{ color: 'blue.5', type: 'bars' }}
					/>
					{filtered.length === 0 ? (
						<Text c="dimmed">Нет запросов для отображения.</Text>
					) : (
						filtered.map((r) => (
							<Box style={{ borderRadius: "xl", overflow: "hidden" }}>

								<Card withBorder radius="xl" key={r.id} h={265} p="xl">
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
														<Text size="md" fw={500}>{r.user?.last_name} {r.user?.first_name} {r.user?.patronymic} </Text>
														<Text size="md">Город: {r.user?.city}</Text>
														<Divider my="xs" />
														{r.user?.company_id && companiesDict[r.user.company_id] && (
															<>
																<Group gap="sm" align="center">
																	<Box>
																		<Image
																			src={BASE_IMAGE_URL + 'companies/' + companiesDict[r.user.company_id].image_url}
																			alt={companiesDict[r.user.company_id].name}
																			width={40}
																			height={40}
																			fit="cover"
																		/>
																	</Box>
																	<Text size="sm" fw={500}>
																		{companiesDict[r.user.company_id].name}
																	</Text>
																</Group>
																<Divider my="xs" />
															</>
														)}
														<Text size="sm">Почта: {r.user?.email}</Text>
														<Text size="sm">
															Дата рождения: {dayjs(r.user?.birthday).format('DD.MM.YYYY')} (
															Возраст: {dayjs().diff(r.user?.birthday, 'year')})
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
										<Stack gap={8} style={{ flexGrow: 1, height: '200px' }}>
											<Group justify="space-between" align="start">
												<Stack gap={4}>
													<Group gap="xs">
														<Avatar variant="default">
															<Image
																src={`${BASE_IMAGE_URL}/${r.bicycle.image_url}`}
															/>
														</Avatar>
														<Text fz="28" lh={1.2} fw={700} lineClamp={1} title={r.bicycle.name}>
															{r.bicycle.name}
														</Text>
													</Group>
													<Text size="sm" c="dimmed">
														Последнее обновление заявки: {dayjs(r.updated_at).format('DD.MM.YYYY')}
													</Text>
												</Stack>

												<Group gap="xs">
													<Button
														variant="default"
														size="sm"
														radius="md"
														onClick={() => handleDetails(r)}
													>
														Детали
													</Button>

													<Menu position="bottom-end" radius="md" trigger="click-hover" openDelay={100} closeDelay={400} shadow="sm" width={220}
													>
														<Menu.Target>
															<Button
																variant="subtle"
																size="sm"
																radius="md"
																px={8}
															>
																<IconDotsVertical size={18} />
															</Button>
														</Menu.Target>
														<Menu.Dropdown
															style={{
																borderRadius: 'var(--mantine-radius-lg)',
																boxShadow: '0 6px 24px rgba(0, 0, 0, 0.35)',
																padding: 'var(--mantine-spacing-sm)',
															}}
														>
															{handleActions(
																r.id!,
																r.status
															)}
														</Menu.Dropdown>
													</Menu>

												</Group>
											</Group>

											<SimpleGrid cols={2} spacing={0}>
												<Stack gap={0}>
													<Text size="md">
														Период:{" "}
														{r.start_date && r.start_date !== '0001-01-01T00:00:00Z'
															? dayjs(r.start_date).format('DD.MM.YYYY')
															: '—'}{" "}
														-{" "}
														{r.expire_date && r.expire_date !== '0001-01-01T00:00:00Z'
															? dayjs(r.expire_date).format('DD.MM.YYYY')
															: '—'}
														{r.start_date && r.expire_date &&
															r.start_date !== '0001-01-01T00:00:00Z' &&
															r.expire_date !== '0001-01-01T00:00:00Z' && (
																<> ({dayjs(r.expire_date).diff(dayjs(r.start_date), 'day') + 1} дней)</>
															)}
													</Text>

													<Text size="md" lineClamp={1}>
														Аксессуары: {r.accessories.length > 0 ? 'есть' : 'нет'}
													</Text>
												</Stack>

												<Stack gap={0}>
													<Text size="md">
														Аренда: {(r.rent_price / 100).toLocaleString()} ₽
													</Text>
													<Text size="md">
														Аксессуары: {(r.accessory_price / 100).toLocaleString()} ₽
													</Text>
													<Text size="md">
														Общая сумма: {(r.rent_price / 100 + r.accessory_price / 100).toLocaleString()} ₽
													</Text>
												</Stack>
											</SimpleGrid>
											<Group mt="auto" mb="8" align="flex-end">
												<Text size="md" fw={700} title={r.status}>
													Текущий статус:
												</Text>
												<Pill c="blue">
													{r.status}
												</Pill>
											</Group>

										</Stack>
									</Group>
								</Card>
								{/* Блок аксессуаров — серая подложка снизу */}
								{r.accessories.length > 0 && (
									<Box
										bg="gray.1"
										style={{
											marginTop: '-2rem',
											padding: "3.5rem 1rem 1.5rem 1rem",
											borderBottomLeftRadius: "2rem",
											borderBottomRightRadius: "2rem",
										}}
									>
										<Text ta="center" size="lg" mb="md" fw={500} c="black">
											Выбранные аксессуары
										</Text>

										<Group px="xl" gap="xl" wrap="wrap">
											{r.accessories.map((item) => (
												<Stack
													key={item.id}
													align="center"
													gap={4}
													p="xs"
													style={{
														backgroundColor: "white",
														borderRadius: "16px",
														width: 100,
													}}
												>
													<Image
														src={`${BASE_IMAGE_URL}/${item.image_url}`}
														alt={item.name}
														width={60}
														height={60}
														fit="contain"
													/>
													<Text size="xs" ta="center" color="black">
														{item.name}
													</Text>
												</Stack>
											))}
										</Group>
									</Box>
								)}
							</Box>
						))
					)}
				</Stack>
			</Stack >

			<Modal
				opened={modalOpened}
				onClose={() => setModalOpened(false)}
				size="lg"
				title={'Детали аренды id: ' + selectedRent?.id}
				centered
				padding="md"
				radius="md"
				overlayProps={{ blur: 4, opacity: 0.2 }}
			>
				{selectedRent && (
					<ScrollArea h={400}>
						<Paper radius="md" p="md" withBorder>
							<Stack gap="xs">
								<Group gap="xs">
									<ThemeIcon variant="light" color="blue" radius="xl">
										<IconUser size={18} />
									</ThemeIcon>
									<Text size="sm"><b>Пользователь:</b> {selectedRent.user?.last_name} {selectedRent.user?.first_name}</Text>
								</Group>

								<Group gap="xs">
									<ThemeIcon variant="light" color="green" radius="xl">
										<IconBike size={18} />
									</ThemeIcon>
									<Text size="sm"><b>Велосипед:</b> {selectedRent.bicycle.name}</Text>
								</Group>

								<Group gap="xs">
									<ThemeIcon variant="light" color="violet" radius="xl">
										<IconCalendar size={18} />
									</ThemeIcon>
									<Text size="md">
										Период:{" "}
										{selectedRent.start_date && selectedRent.start_date !== '0001-01-01T00:00:00Z'
											? dayjs(selectedRent.start_date).format('DD.MM.YYYY')
											: '—'}{" "}
										-{" "}
										{selectedRent.expire_date && selectedRent.expire_date !== '0001-01-01T00:00:00Z'
											? dayjs(selectedRent.expire_date).format('DD.MM.YYYY')
											: '—'}
										{selectedRent.start_date && selectedRent.expire_date &&
											selectedRent.start_date !== '0001-01-01T00:00:00Z' &&
											selectedRent.expire_date !== '0001-01-01T00:00:00Z' && (
												<> ({dayjs(selectedRent.expire_date).diff(dayjs(selectedRent.start_date), 'day') + 1} дней)</>
											)}
									</Text>
								</Group>

								<Divider my="xs" />

								<Text size="sm"><b>ID аренды:</b> {selectedRent.id}</Text>

								<Group gap="xs">
									<Text size="sm"><b>Статус:</b></Text>
									<Badge color={
										(selectedRent.status === 'арендован' || selectedRent.status === 'аренда продлена') ? 'green' :
											selectedRent.status === 'в обработке' ? 'yellow' :
												selectedRent.status === 'завершен' ? 'blue' :
													'red'
									}>
										{selectedRent.status}
									</Badge>
								</Group>

								<Group gap="xs">
									<Text size="sm"><b>Полная сумма:</b> {(selectedRent.rent_price / 100 + selectedRent.accessory_price / 100).toLocaleString()} ₽</Text>
								</Group>

								{selectedRent.accessories.length > 0 && (
									<Box>
										<Text size="sm" fw={500}>Аксессуары:</Text>
										<Text size="sm" c="dimmed">{selectedRent.accessories.map(a => a.name).join(', ')}</Text>
									</Box>
								)}
							</Stack>
						</Paper>

						<Group justify="flex-end" mt="md">
							<Button variant="outline" color="gray" onClick={() => setModalOpened(false)}>
								Закрыть
							</Button>
							<Button onClick={() => {
								setModalOpened(false);
								handleEditRent(selectedRent);
							}}>
								Редактировать
							</Button>
						</Group>
					</ScrollArea>
				)}
			</Modal>

			{isModalOpen && editingRent && updateData && (
				<Modal
					opened={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					title="Редактировать аренду"
					size="lg"
					centered
				>
					<Stack>
						<DateInput
							label="Дата начала"
							placeholder="Выберите дату"
							valueFormat="YYYY-MM-DD"
							value={
								updateData.startDate?.startsWith('0001-01-01')
									? new Date()
									: dayjs(updateData.startDate).toDate()
							}
							onChange={(date) => {
								if (date) {
									setUpdateData((prev) => ({
										...prev!,
										startDate: dayjs(date).format('YYYY-MM-DD'),
									}));
								}
							}}
						/>

						<Select
							label="Статус"
							data={[
								{ value: 'в обработке', label: 'В обработке' },
								{ value: 'арендован', label: 'Арендован' },
								{ value: 'завершен', label: 'Завершен' },
								{ value: 'отказано', label: 'Отказано' },
								{ value: 'аренда продлена', label: 'Аренда продлена' },
							]}
							value={updateData.status}
							onChange={(value) =>
								setUpdateData((prev) => ({ ...prev!, status: value || prev!.status }))
							}
						/>

						<Text fw={600}>Выберите аксессуары</Text>
						<AccessorySelectCardList
							selectedAccessories={updateData.accessories || []}
							onChangeSelected={(ids) => {
								const resolvedIds = typeof ids === 'function' ? ids(updateData.accessories || []) : ids;
								setUpdateData((prev) => ({
									...prev!,
									accessories: resolvedIds,
								}));
							}}
						/>

						<Group mt="md">
							<Button
								onClick={async () => {
									try {
										setLoadingRents(true);
										await updateRent(editingRent.id!, updateData);
										showNotification({
											title: 'Успешно',
											message: 'Аренда обновлена',
											color: 'green',
										});
										await refreshRents();
										setIsModalOpen(false);
									} catch (error) {
										showNotification({
											title: 'Ошибка',
											message: 'Не удалось обновить аренду',
											color: 'red',
										});
									} finally {
										setLoadingRents(false);
									}
								}}
							>
								Сохранить
							</Button>
							<Button variant="outline" onClick={() => setIsModalOpen(false)}>
								Отмена
							</Button>
						</Group>
					</Stack>
				</Modal>
			)}

		</Container >
	);
}