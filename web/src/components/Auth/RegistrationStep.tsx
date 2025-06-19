import {
	Button,
	Card,
	Center,
	CloseButton,
	Container,
	Group,
	Input,
	LoadingOverlay,
	Paper,
	SimpleGrid,
	Stack,
	Text,
	TextInput,
	ThemeIcon,
	Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { IconAlertSquareRounded, IconBolt, IconSearch } from "@tabler/icons-react";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { useEffect, useState } from "react";
import { IMaskInput } from "react-imask";
import { useAuth } from "../../hooks/useAuth";
import { completeRegistration } from "../../services/authService";
import { companyService } from "../../services/companyService";
import type { Company } from "../../types/company";
import { CityPicker } from "./CityPicker";
import CompanyCard from "./CompanyCard";

export default function RegistrationStep() {
	const { email } = useAuth();
	const [step, setStep] = useState(1);
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [companies, setCompanies] = useState<Company[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const form = useForm({
		initialValues: {
			firstName: "",
			lastName: "",
			patronymic: "",
			phone: "",
			birthday: null as Date | null,
			city: "",
		},

		validate: {
			firstName: (v) => (v.trim().length < 2 ? "Введите имя" : null),
			lastName: (v) => (v.trim().length < 2 ? "Введите фамилию" : null),
			phone: (v) =>
				/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(v) ? null : "Введите корректный номер",
			birthday: (v) => {
				if (!v) return "Укажите дату рождения";
				const now = new Date();
				const age = now.getFullYear() - v.getFullYear();
				const m = now.getMonth() - v.getMonth();
				const is18 = age > 18 || (age === 18 && (m > 0 || (m === 0 && now.getDate() >= v.getDate())));
				return is18 ? null : "Вам должно быть 18+";
			},
			city: (v) => (v.trim() === "" ? "Выберите город" : null),
		},
	});

	useEffect(() => {
		const fetchCompanies = async () => {
			try {
				const data = await companyService.getAllCompanies();
				setCompanies(data);
			} catch (err) {
				console.error("Ошибка загрузки компаний:", err);
			} finally {
				setLoading(false);
			}
		};
		fetchCompanies();
	}, []);

	const handleBirthdayChange = (value: Date | null) => {
		form.setFieldValue("birthday", value);
		if (value) {
			const now = new Date();
			const age = now.getFullYear() - value.getFullYear();
			const m = now.getMonth() - value.getMonth();
			const is18 = age > 18 || (age === 18 && (m > 0 || (m === 0 && now.getDate() >= value.getDate())));
			if (!is18) {
				modals.open({
					title: "Возрастное ограничение",
					centered: true,
					radius: "lg",
					children: (
						<Center>
							<Group>
								<IconAlertSquareRounded color="red" size={45} />
								<Text style={{ width: "85%" }}>
									Для регистрации вам должно быть не менее 18 лет.
								</Text>
							</Group>
						</Center>
					),
				});
			}
		}
	};

	const handleNext = () => {
		if (selectedId === undefined) {
			setError("Пожалуйста, выберите компанию или 'Без компании'");
			return;
		}
		setError(null);
		setStep(2);
	};

	const handleBack = () => setStep(1);

	const handleSubmit = form.onSubmit(async (values) => {
		const modalId = modals.open({
			title: "Регистрация",
			centered: true,
			withCloseButton: false,
			radius: "md",
			children: (
				<Center>
					<LoadingOverlay visible overlayProps={{ radius: "sm", blur: 2 }} />
					<Text ml="md">Пожалуйста, подождите...</Text>
				</Center>
			),
		});

		try {
			await completeRegistration({
				email,
				first_name: values.firstName,
				last_name: values.lastName,
				patronymic: values.patronymic,
				phone_number: values.phone,
				birthday: dayjs(values.birthday).format("YYYY-MM-DD"),
				city: values.city,
				company_id: selectedId,
			});

			modals.updateModal({
				modalId,
				title: "Регистрация завершена!",
				children: (
					<Stack gap="md">
						<Group wrap="nowrap">
							<ThemeIcon variant="light" color="green" size="80px" radius="50%">
								<IconBolt style={{ width: "60%", height: "60%" }} />
							</ThemeIcon>
							<Text size="sm">Теперь вы можете арендовать электровелосипед в пару кликов</Text>
						</Group>
						<Button
							onClick={() => {
								modals.closeAll();
								window.location.href = "/dashboard";
							}}
							radius="md"
						>
							Перейти в личный кабинет
						</Button>
					</Stack>
				),
			});
		} catch {
			modals.updateModal({
				modalId,
				title: "Ошибка регистрации",
				withCloseButton: true,
				children: (
					<Stack gap="md">
						<Group wrap="nowrap">
							<ThemeIcon variant="light" color="red" size="80px" radius="50%">
								<IconAlertSquareRounded style={{ width: "60%", height: "60%" }} />
							</ThemeIcon>
							<Text size="sm" c="red">
								Произошла ошибка при регистрации. Попробуйте позже.
							</Text>
						</Group>
						<Button color="red" onClick={() => window.location.href = "/"} radius="md">
							Перейти на главную
						</Button>
					</Stack>
				),
			});
		}
	});

	const filteredCompanies = companies.filter((c) =>
		c.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<Container size="lg" py="xl">
			<Paper radius="xl" bg="white" p="xl">
				{step === 1 ? (
					<Stack gap="xl">
						<Title fz={{ base: "24px", sm: "26px" }}>Выберите компанию</Title>
						<Input
							placeholder="Поиск компании..."
							leftSection={<IconSearch size={20} />}
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.currentTarget.value)}
							radius="xl"
							rightSectionPointerEvents="all"
							rightSection={
								<CloseButton
									aria-label="Очистить"
									onClick={() => setSearchQuery("")}
									style={{ display: searchQuery ? undefined : "none" }}
								/>
							}
						/>
						{loading ? (
							<LoadingOverlay visible loaderProps={{ color: "blue.5", type: "bars" }} />
						) : (
							<SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="lg">
								{filteredCompanies.map((company) => (
									<CompanyCard
										key={company.id}
										company={company}
										selected={selectedId === company.id}
										onSelect={setSelectedId}
									/>
								))}
								<Card
									shadow="sm"
									radius="lg"
									bg="gray.2"
									withBorder
									onClick={() => setSelectedId(null)}
									style={{
										cursor: "pointer",
										aspectRatio: "1",
										border: selectedId === null ? "1px solid #228be6" : undefined,
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<Title fz="sm">Без компании</Title>
									<Text size="xs" color="dimmed" mt="xs">
										Частное лицо
									</Text>
								</Card>
							</SimpleGrid>
						)}
						{error && <Text c="red" size="sm">{error}</Text>}
						<Group justify="right" mt="md">
							<Button onClick={handleNext} size="md" radius="md">
								Далее
							</Button>
						</Group>
					</Stack>
				) : (
					<form onSubmit={handleSubmit}>
						<Stack gap="md">
							<Title fz="lg">Заполните обязательные поля</Title>
							<SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md" verticalSpacing="md">
								<TextInput
									label="Фамилия"
									placeholder="Например, Иванов"
									radius="md"
									required
									{...form.getInputProps("lastName")}
								/>
								<TextInput
									label="Имя"
									placeholder="Например, Владимир"
									radius="md"
									required
									{...form.getInputProps("firstName")}
								/>
								<TextInput
									label="Отчество"
									placeholder="(не обязательно)"
									radius="md"
									{...form.getInputProps("patronymic")}
								/>
								<Input.Wrapper label="Телефон" required error={form.errors.phone}>
									<Input
										component={IMaskInput}
										mask="+7 (000) 000-00-00"
										placeholder="+7 (999) 123-45-67"
										radius="md"
										{...form.getInputProps("phone")}
									/>
								</Input.Wrapper>
								<DateInput
									locale="ru"
									label="Дата рождения"
									placeholder="Нажмите для выбора даты"
									radius="md"
									required
									clearable
									{...form.getInputProps("birthday")}
									onChange={(date) => {
										if (date) {
											const yyyyMmDd = (new Date(date));
											handleBirthdayChange(yyyyMmDd);
										}
									}}
								/>
								<CityPicker
									value={form.values.city}
									onChange={(value) => form.setFieldValue("city", value)}
								/>
							</SimpleGrid>
							<Group justify="space-between" mt="md">
								<Button variant="default" radius="md" onClick={handleBack}>
									Назад
								</Button>
								<Button type="submit" radius="md">
									Завершить
								</Button>
							</Group>
						</Stack>
					</form>
				)}
			</Paper>
		</Container>
	);
}
