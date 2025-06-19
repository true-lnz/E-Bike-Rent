import {
	Button,
	Card,
	Collapse,
	Container,
	Divider,
	Flex,
	Group,
	LoadingOverlay,
	Menu,
	NumberInput,
	Pill,
	SegmentedControl,
	Select,
	Stack,
	Text,
	Textarea,
	TextInput,
	Title
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconCheckupList, IconDotsVertical, IconEdit, IconFilter, IconHome, IconInfoCircle, IconPhone, IconPhoneCall, IconTool, IconX } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { companyService } from "../../services/companyService";
import { maintenanceService } from "../../services/maintenanceService";
import type { Company } from "../../types/company";
import type { Maintenance } from "../../types/maintenance";
import { MaintenanceDetailModal } from "../Maintenance/MaintenanceDetailModal";
import { UserCard } from "./UserCard";

export default function AdminMaintenanceRequests() {
	const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
	const [statusFilter, setStatusFilter] = useState("заявка в обработке");
	const [phoneFilter, setPhoneFilter] = useState<string>('');
	const [startDateFilter, setStartDateFilter] = useState<Date | null>(null);
	const [endDateFilter, setEndDateFilter] = useState<Date | null>(null);
	const [cityFilter, setCityFilter] = useState<string>('');
	const [filtersContainerOpened, { toggle }] = useDisclosure(false);

	const [selectedMaintenance, setSelectedMaintenance] = useState<Maintenance | null>(null);
	const [modalOpened, setModalOpened] = useState(false);
	const [loadingMaintenance, setLoadingMaintenance] = useState(false);
	const [companiesDict, setCompaniesDict] = useState<Record<number, Company>>({});
	const isMobile = useMediaQuery("(max-width: 576px)");


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
				showNotification({
					title: "Ошибка",
					message: `Ошибка загрузки компаний: ${err}`,
					color: "red",
					radius: 'md',
					icon: <IconX size={16} />,
				})
			}
		};
		fetchCompanies();
	}, []);

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

	/* 	const filtered = maintenances.filter((m) => {
			if (statusFilter === "done") {
				return ["завершен", "отказано"].includes(m.status);
			}
			return m.status === statusFilter;
		}); */

	const filtered = maintenances.filter((m) => {
		if (statusFilter === "done") {
			return ["завершен", "отказано"].includes(m.status);
		}

		if (phoneFilter && m.user?.phone_number) {
			const cleanPhoneFilter = phoneFilter.replace(/\D/g, '');
			const cleanPhone = m.user.phone_number.replace(/\D/g, '');
			if (!cleanPhone.includes(cleanPhoneFilter)) return false;
		}

		if (startDateFilter && m.start_date) {
			const rentalStart = new Date(m.start_date);
			if (rentalStart < startDateFilter) return false;
		}

		if (endDateFilter && m.finish_date) {
			const rentalEnd = new Date(m.finish_date);
			if (rentalEnd > endDateFilter) return false;
		}

		if (cityFilter && m.user?.city) {
			if (!m.user.city.toLowerCase().includes(cityFilter.toLowerCase())) return false;
		}

		return m.status === statusFilter;
	});

	const clearAllFilters = () => {
		setPhoneFilter('');
		setStartDateFilter(null);
		setEndDateFilter(null);
		setCityFilter('');
	};

	const handleActions = (
		id: number,
		status: string,
		data: {
			bicycle_name: string;
			finish_date: string;
			admin_message: string;
			price: number;
		},
		start_date: string
	): React.ReactNode => {
		const actions: React.ReactNode[] = [];

		if (status === 'заявка в обработке') {
			actions.push(
				<Menu.Item
					key="accept"
					c="green"
					leftSection={<IconCheck size={16} />}
					onClick={() => {
						handleAccept(id, data.bicycle_name, start_date);
					}}
				>
					Принять
				</Menu.Item>,
				<Menu.Item
					key="reject"
					color="red"
					leftSection={<IconX size={16} />}
					onClick={() => {
						handleReject(id, { ...data, status });
					}}
				>
					Отказать
				</Menu.Item>
			);
		} else if (status === 'ремонтируется' || status === 'готов к выдаче') {
			actions.push(
				<Menu.Item
					key="edit"
					leftSection={<IconEdit size={16} />}
					onClick={() => {
						handleEditMaintenance(id, { ...data, status }, start_date);
					}}
				>
					Редактировать
				</Menu.Item>,
				<Menu.Item
					key="ready"
					color="blue.7"
					leftSection={<IconTool size={16} />}
					onClick={() => {
						handleComplete(id, data, 2);
					}}
				>
					Готов к выдаче
				</Menu.Item>,
				<Menu.Item
					key="complete"
					color="blue.7"
					leftSection={<IconCheckupList size={16} />}
					onClick={() => {
						handleComplete(id, data, 1);
					}}
				>
					Завершить
				</Menu.Item>
			);
		}

		return actions.length > 0 ? actions : (
			<Menu.Item disabled>
				<Text size="sm" c="dimmed">Нет доступных действий</Text>
			</Menu.Item>
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
		},
		start_date: string
	) => {
		let state = { ...initialData };
		modals.openConfirmModal({
			title: 'Редактировать заявку',
			size: 'lg',
			centered: true,
			closeOnConfirm: false,
			radius: "lg",
			labels: { confirm: 'Сохранить', cancel: 'Отмена' },
			children: (
				<Stack>
					<TextInput
						label="Название велосипеда"
						radius="md"
						defaultValue={state.bicycle_name}
						onChange={(e) => (state.bicycle_name = e.currentTarget.value)}
					/>

					<Select
						label="Статус"
						radius="md"
						data={[
							{ value: 'заявка в обработке', label: 'Заявка в обработке' },
							{ value: 'ремонтируется', label: 'Ремонтируется' },
							{ value: 'готов к выдаче', label: 'Готов к выдаче' },
							{ value: 'завершен', label: 'Завершен' },
							{ value: 'отказано', label: 'Отказано' },
						]}
						defaultValue={state.status}
						allowDeselect={false}
						onChange={(value) => (state.status = value ?? state.status)}
					/>

					<DateInput
						label="Дата завершения"
						placeholder="Выберите дату"
						valueFormat="YYYY-MM-DD"
						radius="md"
						defaultValue={state.finish_date}
						minDate={start_date}
						onChange={(date) => {
							if (date) {
								const yyyyMmDd = (new Date(date)).toISOString().slice(0, 10); // 'YYYY-MM-DD'
								state.finish_date = yyyyMmDd;
							}
						}}
					/>

					<NumberInput
						label="Стоимость (в копейках ₽)"
						defaultValue={state.price}
						min={0}
						step={100}
						radius="md"
						onChange={(value) => {
							state.price = Number(value) || 0;
						}}
					/>

					<Textarea
						label="Комментарий администратора"
						defaultValue={state.admin_message}
						autosize
						minRows={4}
						radius="md"
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
			radius: "lg",
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
				if (currentData.finish_date && currentData.finish_date.includes('T')) {
					currentData.finish_date = new Date(currentData.finish_date).toISOString().slice(0, 10);
				}
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

	const handleEditDate = (
		maintenanceId: number,
		currentFinishDate: string,
		currentData: {
			bicycle_name: string;
			status: string;
			admin_message: string;
			price: number;
		},
		startDate: string // ← дата начала заявки
	) => {
		let newDate =
			!currentFinishDate || currentFinishDate.startsWith('0001-01-01')
				? new Date().toISOString()
				: currentFinishDate;

		const minDate = new Date(startDate); // ← не раньше этой даты

		modals.openConfirmModal({
			title: 'Изменить дату завершения',
			labels: { confirm: 'Сохранить', cancel: 'Отмена' },
			closeOnConfirm: false,
			centered: true,
			radius: 'lg',
			children: (
				<DateInput
					label="Новая дата завершения"
					defaultValue={newDate}
					valueFormat="DD.MM.YYYY"
					radius="md"
					minDate={minDate} // запрещает выбирать дату до startDate
					onChange={(date) => {
						if (date) newDate = date;
					}}
				/>
			),
			onConfirm: async () => {
				setLoadingMaintenance(true);
				if (newDate && newDate.includes('T')) {
					newDate = new Date(newDate).toISOString().slice(0, 10);
				}
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
						message: `Не удалось обновить дату: ${error}`,
						color: 'red',
					});
				} finally {
					setLoadingMaintenance(false);
				}
			},
		});
	};


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
			radius: "lg",
			children: (
				<Textarea
					label="Комментарий"
					placeholder="Укажите причину отказа"
					autosize
					radius="md"
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
					radius: "lg",
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

	const handleAccept = (maintenanceId: number, bicycleName: string, startDate: string) => {
		let status = 'ремонтируется';
		let finishDate = '';
		let adminMessage = '';
		let price = 0;

		modals.openConfirmModal({
			title: 'Комментарий администратора',
			labels: { confirm: 'Далее', cancel: 'Отмена' },
			closeOnConfirm: false,
			centered: true,
			radius: "lg",
			children: (
				<Textarea
					label="Комментарий администратора"
					placeholder="Введите комментарий..."
					autosize
					required
					radius="md"
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
					radius: "lg",
					children: (
						<NumberInput
							label="Стоимость (в копейках ₽)"
							placeholder="Введите стоимость ремонта"
							min={0}
							radius="md"
							required
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
							radius: "lg",
							children: (
								<DateInput
									label="Дата завершения"
									placeholder="Выберите дату"
									valueFormat="YYYY-MM-DD"
									required
									defaultValue={new Date()}
									minDate={startDate}
									radius="md"
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

				<Group w="100%">
					<Button
						radius="md"
						size="sm"
						fullWidth={isMobile}
						color="orange.5"
						onClick={toggle}
						leftSection={<IconFilter size={18} />}
					>
						Все фильтры
					</Button>
					<SegmentedControl
						fullWidth
						radius="md"
						size="md"
						orientation={isMobile ? "vertical" : "horizontal"}
						color="blue.7"
						value={statusFilter}
						onChange={setStatusFilter}
						data={[
							{ label: 'Не обработанные', value: 'заявка в обработке' },
							{ label: 'Ремонтируется', value: 'ремонтируется' },
							{ label: 'Готов к выдаче', value: 'готов к выдаче' },
							{ label: 'Завершенные', value: 'done' },
						]}
						style={{ flexGrow: 1 }}
					/>
				</Group>
				<Collapse in={filtersContainerOpened}>
					<Flex gap="lg" rowGap="xs" wrap="wrap">
						<TextInput
							leftSection={<IconPhone size={16} />}
							placeholder="Поиск по телефону"
							radius="md"
							w={{ base: "100%", xs: "auto" }}
							value={phoneFilter}
							onChange={(e) => setPhoneFilter(e.target.value || '')}
						/>
						<TextInput
							leftSection={<IconHome size={16} />}
							placeholder="Город клиента"
							radius="md"
							w={{ base: "100%", xs: "auto" }}
							value={cityFilter}
							onChange={(e) => setCityFilter(e.target.value || '')}
						/>
						<DateInput
							placeholder="Дата заявки"
							radius="md"
							w={{ base: "100%", xs: "auto" }}
							value={startDateFilter}
							onChange={(date) => {
								if (date) {
									const yyyyMmDd = (new Date(date));
									setStartDateFilter(yyyyMmDd);
								}
							}}
						/>
						<DateInput
							placeholder="Дата окончания ремонта"
							radius="md"
							w={{ base: "100%", xs: "auto" }}
							value={endDateFilter}
							onChange={(date) => {
								if (date) {
									const yyyyMmDd = (new Date(date));
									setEndDateFilter(yyyyMmDd);
								}
							}}
						/>
						<Button
							radius="md"
							size="sm"
							variant="light"
							fullWidth={isMobile}
							leftSection={<IconX size={18} />}
							onClick={clearAllFilters}
						>
							Сбросить фильтры
						</Button>
					</Flex>
				</Collapse>

				<Stack pos="relative">
					<LoadingOverlay
						visible={loadingMaintenance}
						overlayProps={{ radius: 'sm', blur: 2 }}
						loaderProps={{ color: 'blue.5', type: 'bars' }}
					/>
					{filtered.length === 0 ? (
						<Text c="dimmed">Нет заявок для отображения.</Text>
					) : (
						filtered.map((m) => (
							<Card withBorder radius="xl" key={m.id} shadow="sm" h={{ base: "auto", sm: 265 }} p="xl">
								<Flex align={isMobile ? "center" : "start"} gap="xl" justify="space-between" wrap="nowrap" direction={isMobile ? "column" : "row"} style={{ width: '100%' }}>
									{/* Левый столбец */}
									<Stack gap={4} w={200} align="center" style={{ height: '100%' }}>
										<UserCard r={m} companiesDict={companiesDict} />
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
									<Stack gap={8} h={{ base: "auto", sm: '200px' }} style={{ flexGrow: 1 }}>
										<Group justify="space-between" align="start">
											<Stack gap={0}>
												<Text fz="28" lh={1.2} fw={700} lineClamp={1} title={m.bicycle_name}>
													Заявка: {m.bicycle_name}
												</Text>
												<Text size="md" c="dimmed">
													Дата заявки: {dayjs(m.created_at).format('DD.MM.YYYY')}
												</Text>
											</Stack>

											<Group gap="xs">
												<Button
													variant="default"
													size="sm"
													radius="md"
													visibleFrom="sm"
													onClick={() => handleDetails(m.id)}
												>
													Детали
												</Button>

												<Menu position="bottom-end" radius="md" trigger="click-hover" openDelay={100} closeDelay={400} shadow="sm" width={220}>
													<Menu.Target>
														<Button variant="subtle" size="sm" radius="md" px={8}>
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
														<Menu.Item
															key="info"
															variant="default"
															hiddenFrom="sm"
															leftSection={<IconInfoCircle size={18} />}
															onClick={() => handleDetails(m.id)}
														>
															Детали
														</Menu.Item>
														{handleActions(
															m.id,
															m.status,
															{
																bicycle_name: m.bicycle_name,
																finish_date: m.finish_date,
																admin_message: m.admin_message || '',
																price: m.price || 0,
															},
															m.start_date
														)}
													</Menu.Dropdown>
												</Menu>
											</Group>
										</Group>

										<Stack gap={0}>
											<Text size="md" lineClamp={1} title={m.details}>
												Детали заявки: {m.details}
											</Text>
											{m.finish_date && (
												<Group>
													<Text size="md">
														Дата окончания ремонта: {m.finish_date && dayjs(m.finish_date).year() > 1
															? dayjs(m.finish_date).format('DD.MM.YYYY')
															: '—'}
													</Text>
													{(m.status === "ремонтируется" || m.status === "готов к выдаче") &&
														<Button
															size="compact-sm"
															p={0}
															variant="transparent"
															onClick={() => {
																handleEditDate(m.id, m.finish_date, {
																	bicycle_name: m.bicycle_name,
																	status: m.status,
																	admin_message: m.admin_message || '',
																	price: m.price || 0,
																}, m.start_date
															)
															}}
														>Изменить</Button>
													}
												</Group>
											)}
											{m.admin_message && (
												<Text size="md" lineClamp={1} title={m.admin_message}>
													Ваш комментарий: {m.admin_message}
												</Text>
											)}
										</Stack>
										<Group mt="auto" mb="8" align="flex-end">
											<Text size="md" fw={700} title={m.status}>
												Текущий статус:
											</Text>
											<Pill c="blue">
												{m.status}
											</Pill>
										</Group>
									</Stack>
								</Flex>
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
