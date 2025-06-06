import {
	Avatar,
	Button,
	Card,
	Container,
	Divider,
	Group,
	HoverCard,
	LoadingOverlay,
	NumberInput,
	Pill,
	Popover,
	SegmentedControl,
	Select,
	Stack,
	Text,
	Textarea,
	TextInput,
	Title
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconDotsVertical, IconPhoneCall } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { maintenanceService } from "../../services/maintenanceService";
import type { Maintenance } from "../../types/maintenance";
import { MaintenanceDetailModal } from "../Maintenance/MaintenanceDetailModal";

/* function isZeroDate(dateString: string) {
	return !dateString || dayjs(dateString).year() === 1;
} */

export default function AdminMaintenanceRequests() {
	const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
	const [statusFilter, setStatusFilter] = useState("заявка в обработке");
	const [selectedMaintenance, setSelectedMaintenance] = useState<Maintenance | null>(null);
	const [modalOpened, setModalOpened] = useState(false);
	const [loadingMaintenance, setLoadingMaintenance] = useState(false);
	const [openedPopoverId, setOpenedPopoverId] = useState<number | null>(null);

	const refreshMaintenances = async () => {
		setLoadingMaintenance(true);
		try {
			const data = await maintenanceService.getAllMaintenances();
			setMaintenances(data);
		} catch (error) {
			showNotification({
				title: 'Ошибка',
				message: 'Не удалось загрузить заявки',
				color: 'red',
			});
		} finally {
			setLoadingMaintenance(false);
		}
	};

	useEffect(() => {
		refreshMaintenances();
	}, []);

	const filtered = maintenances.filter((m) => {
		if (statusFilter === "done") {
			return ["завершен", "отказано"].includes(m.status);
		}
		return m.status === statusFilter;
	});

	const handleActions = (
		id: number,
		status: string,
		data: {
			bicycle_name: string;
			finish_date: string;
			admin_message: string;
			price: number;
		},
		onClose: () => void
	) => {
		const actions: React.ReactNode[] = [];

		if (status === 'заявка в обработке') {
			actions.push(
				<Button
					fullWidth
					color="orange"
					onClick={() => { handleAccept(id, data.bicycle_name); onClose(); }}
					radius="md"
				>
					Принять
				</Button>,
				<Button
					fullWidth
					variant="outline"
					color="red"
					onClick={() => { handleReject(id, { ...data, status }); onClose(); }}
					radius="md"
				>
					Отказать
				</Button>
			);
		} else if (status === 'ремонтируется' || status === 'готов к выдаче') {
			actions.push(
				<Button
					fullWidth
					color="blue"
					onClick={() => { handleEditMaintenance(id, { ...data, status }); onClose(); }}
					radius="md"
				>
					Редактировать
				</Button>,
				<Button
					fullWidth
					color="teal"
					onClick={() => { handleComplete(id, data, 2); onClose(); }}
					radius="md"
				>
					Готов к выдаче
				</Button>,
				<Button
					fullWidth
					color="teal"
					onClick={() => { handleComplete(id, data, 1); onClose(); }}
					radius="md"
				>
					Завершить
				</Button>
			);
		}

		return (
			<Stack p="xs" style={{ width: 200 }}>
				{actions.length > 0 ? actions : <Text size="sm" c="dimmed">Нет доступных действий</Text>}
			</Stack>
		);
	};

	const handleEditMaintenance = (
		maintenanceId: number,
		initialData: {
			bicycle_name: string;
			status: string;
			finish_date: string;
			admin_message: string;
			price: number;
		}
	) => {
		let state = { ...initialData };

		modals.openConfirmModal({
			title: 'Редактировать заявку',
			size: 'lg',
			centered: true,
			closeOnConfirm: false,
			labels: { confirm: 'Сохранить', cancel: 'Отмена' },
			children: (
				<Stack>
					<TextInput
						label="Название велосипеда"
						defaultValue={state.bicycle_name}
						onChange={(e) => (state.bicycle_name = e.currentTarget.value)}
					/>

					<Select
						label="Статус"
						data={[
							{ value: 'заявка в обработке', label: 'Заявка в обработке' },
							{ value: 'ремонтируется', label: 'Ремонтируется' },
							{ value: 'готов к выдаче', label: 'Готов к выдаче' },
							{ value: 'завершен', label: 'Завершен' },
							{ value: 'отказано', label: 'Отказано' },
						]}
						defaultValue={state.status}
						onChange={(value) => (state.status = value ?? state.status)}
					/>

					<DateInput
						label="Дата завершения"
						placeholder="Выберите дату"
						valueFormat="YYYY-MM-DD"
						value={state.finish_date ? new Date(state.finish_date) : null}
						onChange={(date) => {
							if (date) {
								const yyyyMmDd = (new Date(date)).toISOString().slice(0, 10); // 'YYYY-MM-DD'
								state.finish_date = yyyyMmDd;
							}
						}}
					/>

					<NumberInput
						label="Стоимость (₽)"
						defaultValue={state.price}
						min={0}
						step={100}
						onChange={(value) => {
							state.price = Number(value) || 0;
						}}
					/>

					<Textarea
						label="Комментарий администратора"
						defaultValue={state.admin_message}
						autosize
						minRows={4}
						onChange={(e) => (state.admin_message = e.currentTarget.value)}
					/>
				</Stack>
			),
			onConfirm: async () => {
				try {
					setLoadingMaintenance(true);

					if (state.finish_date && state.finish_date.includes('T')) {
						state.finish_date = new Date(state.finish_date).toISOString().slice(0, 10);
					}

					await maintenanceService.updateMaintenance(maintenanceId, state);

					showNotification({
						title: 'Успешно',
						message: 'Заявка обновлена',
						color: 'green',
					});
					await refreshMaintenances();
					modals.closeAll();
				} catch (error) {
					showNotification({
						title: 'Ошибка',
						message: 'Не удалось обновить заявку',
						color: 'red',
					});
				} finally {
					setLoadingMaintenance(false);
				}
			},
		});
	};

	const handleComplete = async (
		maintenanceId: number,
		currentData: {
			bicycle_name: string;
			finish_date: string;
			admin_message: string;
			price: number;
		},
		mode: number
	) => {
		modals.openConfirmModal({
			title: 'Завершить заявку',
			centered: true,
			children: (
				<Text size="sm">
					{mode === 1 ? (
						<>Вы уверены, что хотите завершить эту заявку? Статус будет изменён на <b>завершен</b>.</>
					) : (
						<>Уведомить клиента о готовности к выдаче? Статус будет изменён на <b>завершен</b>.</>
					)}
				</Text>
			),
			labels: { confirm: 'Готово', cancel: 'Отмена' },
			confirmProps: { color: 'teal' },
			onConfirm: async () => {
				setLoadingMaintenance(true);
				try {
					await maintenanceService.updateMaintenance(maintenanceId, {
						...currentData,
						status: mode === 1 ? 'завершен' : 'готов к выдаче',
					});
					showNotification({
						title: 'Успешно',
						message: 'Заявка успешно изменена ',
						color: 'teal',
					});
					await refreshMaintenances();
					modals.closeAll();
				} catch (error) {
					showNotification({
						title: 'Ошибка',
						message: 'Не удалось обработать запрос. Проблемы на сервере',
						color: 'red',
					});
				} finally {
					setLoadingMaintenance(false);
				}
			},
		});
	};

/* 
	const handleEditDate = (
		maintenanceId: number,
		currentFinishDate: string,
		currentData: {
			bicycle_name: string;
			status: string;
			admin_message: string;
			price: number;
		}
	) => {
		let newDate = currentFinishDate || "";

		modals.openConfirmModal({
			title: 'Изменить дату завершения',
			labels: { confirm: 'Сохранить', cancel: 'Отмена' },
			closeOnConfirm: false,
			centered: true,
			children: (
				<DateInput
					label="Новая дата завершения"
					defaultValue={newDate}
					valueFormat="DD.MM.YYYY"
					onChange={(date) => {
						if (date) newDate = date;
					}}
				/>
			),
			onConfirm: async () => {
				setLoadingMaintenance(true);
				try {
					await maintenanceService.updateMaintenance(maintenanceId, {
						...currentData,
						finish_date: newDate,
					});
					showNotification({
						title: 'Успешно',
						message: 'Дата завершения обновлена',
						color: 'green',
					});
					await refreshMaintenances();
					modals.closeAll();
				} catch (error) {
					showNotification({
						title: 'Ошибка',
						message: 'Не удалось обновить дату',
						color: 'red',
					});
				} finally {
					setLoadingMaintenance(false);
				}
			},
		});
	};
 */
	const handleReject = (
		maintenanceId: number,
		currentData: {
			bicycle_name: string;
			finish_date: string;
			admin_message: string;
			status: string;
			price: number;
		}
	) => {
		let adminMessage = "";

		modals.openConfirmModal({
			title: 'Комментарий администратора',
			labels: { confirm: 'Далее', cancel: 'Отмена' },
			closeOnConfirm: false,
			centered: true,
			children: (
				<Textarea
					label="Комментарий"
					placeholder="Укажите причину отказа"
					autosize
					minRows={3}
					onChange={(e) => {
						adminMessage = e.currentTarget.value;
					}}
				/>
			),
			onConfirm: () => {
				modals.openConfirmModal({
					title: 'Подтвердите отказ от заявки',
					labels: { confirm: 'Отказать', cancel: 'Назад' },
					confirmProps: { color: 'red' },
					centered: true,
					children: (
						<Text size="sm">
							Вы уверены, что хотите <b>отклонить</b> заявку #{maintenanceId}? Это действие нельзя отменить.
						</Text>
					),
					onConfirm: async () => {
						setLoadingMaintenance(true);
						try {
							await maintenanceService.updateMaintenance(maintenanceId, {
								...currentData,
								status: 'отказано',
								admin_message: adminMessage,
							});
							await refreshMaintenances();
							showNotification({
								title: 'Успешно',
								message: 'Заявка отклонена',
								color: 'green',
							});
							modals.closeAll();
						} catch (error) {
							showNotification({
								title: 'Ошибка',
								message: 'Ошибка при отказе от заявки: ' + error,
								color: 'red',
							});
							modals.closeAll();
						} finally {
							setLoadingMaintenance(false);
						}
					},
				});
			},
		});
	};

	const handleAccept = (maintenanceId: number, bicycleName: string) => {
		let status = 'ремонтируется';
		let finishDate = '';
		let adminMessage = '';
		let price = 0;

		modals.openConfirmModal({
			title: 'Комментарий администратора',
			labels: { confirm: 'Далее', cancel: 'Отмена' },
			closeOnConfirm: false,
			centered: true,
			children: (
				<Textarea
					label="Комментарий администратора"
					placeholder="Введите комментарий..."
					autosize
					onChange={(e) => {
						adminMessage = e.currentTarget.value;
					}}
				/>
			),
			onConfirm: () => {
				modals.openConfirmModal({
					title: 'Укажите стоимость',
					labels: { confirm: 'Далее', cancel: 'Назад' },
					closeOnConfirm: false,
					centered: true,
					children: (
						<NumberInput
							label="Стоимость"
							placeholder="Введите стоимость ремонта"
							min={0}
							onChange={(val) => {
								price = Number(val);
							}}
						/>
					),
					onConfirm: () => {
						modals.openConfirmModal({
							title: 'Дата завершения',
							labels: { confirm: 'Подтвердить', cancel: 'Назад' },
							closeOnConfirm: false,
							centered: true,
							children: (
								<DateInput
									label="Дата завершения"
									placeholder="Выберите дату"
									valueFormat="YYYY-MM-DD"
									onChange={(date) => {
										if (date) finishDate = date;
									}}
								/>
							),
							onConfirm: async () => {
								setLoadingMaintenance(true);
								try {
									await maintenanceService.updateMaintenance(maintenanceId, {
										bicycle_name: bicycleName,
										status,
										finish_date: finishDate,
										admin_message: adminMessage,
										price,
									});
									showNotification({
										title: 'Заявка принята',
										message: 'Данные успешно сохранены',
										color: 'green',
									});
									await refreshMaintenances();
									modals.closeAll();
								} catch (error) {
									showNotification({
										title: 'Ошибка',
										message: 'Не удалось обновить заявку',
										color: 'red',
									});
								} finally {
									setLoadingMaintenance(false);
								}
							},
						});
					},
				});
			},
		});
	};

	const handleDetails = async (id: number) => {
		try {
			const maintenance = await maintenanceService.getMaintenanceById(id);
			setSelectedMaintenance(maintenance);
			setModalOpened(true);
		} catch (error) {
			showNotification({
				title: 'Ошибка',
				message: 'Ошибка при загрузке заявки: ' + error,
				color: 'red',
			});
		}
	};

	return (
		<Container size="lg" mb={80}>
			<Stack gap="md">
				<Title order={2}>Заявки на обслуживание</Title>

				<SegmentedControl
					fullWidth
					radius="xl"
					size="md"
					color="blue.7"
					value={statusFilter}
					onChange={setStatusFilter}
					data={[
						{ label: 'Не обработанные', value: 'заявка в обработке' },
						{ label: 'Ремонтируется', value: 'ремонтируется' },
						{ label: 'Готов к выдаче', value: 'готов к выдаче' },
						{ label: 'Завершенные', value: 'done' },
					]}
				/>

				<Stack>
					<LoadingOverlay visible={loadingMaintenance}></LoadingOverlay>
					{filtered.length === 0 ? (
						<Text c="dimmed">Нет заявок для отображения.</Text>
					) : (
						filtered.map((m) => (
							<Card withBorder radius="lg" key={m.id} shadow="sm" h={265} p="xl">
								<Group align="start" justify="space-between" wrap="nowrap" style={{ width: '100%' }}>
									{/* Левый столбец */}
									<Stack gap={4} w={200} align="center" style={{ height: '100%' }}>
										<HoverCard width={260} shadow="md" withArrow position="right-start">
											<HoverCard.Target>
												<Group gap="sm" justify="center" style={{ cursor: 'pointer' }}>
													<Avatar
														size={80}
														name={`${m.user.first_name} ${m.user.last_name}`}
														radius={9999}
													/>
													<Text fw={700} fz="xl" style={{ whiteSpace: 'nowrap' }}>
														{m.user.last_name} {m.user.first_name[0]}.{m.user.patronymic?.[0] || ''}.
													</Text>
												</Group>
											</HoverCard.Target>

											<HoverCard.Dropdown>
												<Stack gap={4}>
													<Text size="sm" fw={500}>{m.user.last_name} {m.user.first_name} {m.user.patronymic} </Text>
													<Text size="sm">📧 Почта: {m.user.email}</Text>
													<Text size="sm">
														🎂 Дата рождения: {dayjs(m.user.birthday).format('DD.MM.YYYY')} (
														{dayjs().diff(m.user.birthday, 'year')} лет)
													</Text>
													<Button
														variant="light"
														color="gray"
														size="xs"
														radius="md"
														fullWidth
														component={Link}
														to={`tel:${m.user.phone_number}`}
														leftSection={<IconPhoneCall size={14} />}
													>
														Позвонить
													</Button>
												</Stack>
											</HoverCard.Dropdown>
										</HoverCard>

										<Text size="sm">Тел.: {m.user.phone_number}</Text>
										<Button
											variant="light"
											color="gray"
											size="sm"
											mt="auto"
											radius="xl"
											fullWidth
											component={Link}
											to={`tel:${m.user.phone_number}`}
											leftSection={<IconPhoneCall size={14} />}
										>
											Связаться с клиентом
										</Button>
									</Stack>
									<Divider orientation="vertical" />

									{/* Правый столбец */}
									<Stack gap={4} style={{ flexGrow: 1, height: '200px' }}>
										<Group justify="space-between" align="start">
											<Text fz="xl" fw={700} lineClamp={1} title={m.bicycle_name}>
												Заявка: {m.bicycle_name}
											</Text>

											<Group gap="xs">
												<Button
													variant="default"
													size="sm"
													radius="md"
													onClick={() => handleDetails(m.id)}
												>
													Детали
												</Button>

												<Popover width={220} position="bottom-end" opened={openedPopoverId === m.id}
													onChange={(open) => {
														setOpenedPopoverId(open ? m.id : null);
													}}>
													<Popover.Target>
														<Button variant="subtle" size="sm" radius="md" px={8}
															onClick={() =>
																setOpenedPopoverId((current) => (current === m.id ? null : m.id))
															}>
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
														{handleActions(m.id, m.status, {
															bicycle_name: m.bicycle_name,
															finish_date: m.finish_date,
															admin_message: m.admin_message || '',
															price: m.price || 0,
														},
															() => setOpenedPopoverId(null)
														)}
													</Popover.Dropdown>
												</Popover>
											</Group>
										</Group>


										<Text size="md" c="dimmed">
											Дата заявки: {dayjs(m.created_at).format('DD.MM.YYYY')}
										</Text>

										<Text size="md" lineClamp={1} title={m.details}>
											Детали заявки: {m.details}
										</Text>

										{m.finish_date && (
											<Text size="md">
												Дата окончания ремонта: {dayjs(m.finish_date).format('DD.MM.YYYY')}
											</Text>
										)}

										{m.admin_message && (
											<Text size="md" lineClamp={1} title={m.admin_message}>
												Ваш комментарий: {m.admin_message}
											</Text>
										)}
										<Group mt="auto" mb="8" align="flex-end">
											<Text size="md" fw={700} title={m.status}>
												Текущий статус:
											</Text>
											<Pill c="blue">
												{m.status}
											</Pill>
										</Group>
									</Stack>
								</Group>
							</Card>
						))
					)}
				</Stack>
			</Stack>
			<MaintenanceDetailModal
				opened={modalOpened}
				onClose={() => setModalOpened(false)}
				maintenance={selectedMaintenance}
			/>

		</Container >
	);
}
