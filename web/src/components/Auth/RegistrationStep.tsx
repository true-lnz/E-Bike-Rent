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
	Title
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { modals } from "@mantine/modals";
import { IconAlertSquareRounded, IconBolt, IconSearch } from "@tabler/icons-react";
import dayjs from "dayjs";
import 'dayjs/locale/ru';
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
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [patronymic, setPatronymic] = useState("");
	const [city, setCity] = useState("");
	const [phone, setPhone] = useState("");
	const [birthday, setBirthday] = useState<Date | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [companies, setCompanies] = useState<Company[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isValid, setIsValid] = useState(false);

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

	useEffect(() => {
		setIsValid(
			firstName.trim() !== "" &&
			lastName.trim() !== "" &&
			phone.trim() !== "" &&
			city.trim() !== "" &&
			birthday !== null
		);
	}, [firstName, lastName, phone, city, birthday]);

	const filteredCompanies = companies.filter((company) =>
		company.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const is18OrOlder = (date: Date) => {
		const now = new Date();
		const birthDate = new Date(date);
		const age = now.getFullYear() - birthDate.getFullYear();
		const m = now.getMonth() - birthDate.getMonth();
		return age > 18 || (age === 18 && m >= 0 && now.getDate() >= birthDate.getDate());
	};

	const handleBirthdayChange = (value: Date | null) => {
		setBirthday(value);
		if (value && !is18OrOlder(value)) {
			modals.open({
				title: "Возрастное ограничение",
				centered: true,
				radius: "lg",
				children: (
					<Center>
						<Group>
							<IconAlertSquareRounded color="red" size={45} />
							<Text style={{ width: "85%" }}>
								Для регистрации вам должно быть не менее 18 лет. Пожалуйста, укажите корректную дату рождения.
							</Text>
						</Group>
					</Center>
				),
			});
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

	const handleBack = () => {
		setStep(1);
	};

	const handleSubmit = async () => {
		if (!firstName || !lastName || !phone || !city || !birthday) return;

		const modalId = modals.open({
			title: 'Регистрация',
			centered: true,
			withCloseButton: false,
			radius: 'md',
			children: (
				<Center>
					<LoadingOverlay
						visible
						overlayProps={{ radius: 'sm', blur: 2 }}
						loaderProps={{ color: 'blue.5', type: 'bars' }}
					/>
					<Text ml="md">Пожалуйста, подождите...</Text>
				</Center>
			),
		});

		try {
			await completeRegistration({
				email,
				first_name: firstName,
				last_name: lastName,
				patronymic,
				phone_number: phone,
				birthday: dayjs(birthday).format("YYYY-MM-DD"),
				city: city,
				company_id: selectedId,
			});

			modals.updateModal({
				modalId,
				title: 'Регистрация завершена!',
				radius: 'md',
				children: (
					<Stack gap="md" justify="center">
						<Group wrap="nowrap">
							<ThemeIcon variant="light" color="green" size="80px" radius="50%">
								<IconBolt style={{ width: '60%', height: '60%' }} />
							</ThemeIcon>
							<Text size="sm">Теперь вы можете арендовать любой электровелосипед в пару кликов</Text>
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
		} catch (e) {
			modals.updateModal({
				modalId,
				title: 'Ошибка регистрации',
				withCloseButton: true,
				radius: 'md',
				children: (
					<Stack gap="md" justify="center">
						<Group wrap="nowrap">
							<ThemeIcon variant="light" color="red" size="80px" radius="50%">
								<IconAlertSquareRounded style={{ width: '60%', height: '60%' }} />
							</ThemeIcon>
							<Text size="sm" c="red">Произошла ошибка при регистрации, или сайт сейчас не доступен. Попробуйте позже.</Text>
						</Group>
						<Button
							color="red"
							onClick={() => {
								modals.closeAll();
								window.location.href = "/";
							}}
							radius="md"
						>
							Перейти на главную
						</Button>
					</Stack>
				),
			});
		}
	};

	return (
		<Container size="lg" py="xl">
			<Paper radius="xl" bg="white" p="xl">

				{step === 1 ? (
					<Stack gap="xl" bg="white">
						<Title fz={{ base: "24px", sm: "26px" }}  >Выберите компанию</Title>
						<Input
							placeholder="Поиск компании..."
							leftSection={<IconSearch size={20} />}
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.currentTarget.value)}
							size="md"
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
							<LoadingOverlay
								visible
								overlayProps={{ radius: 'sm', blur: 2 }}
								loaderProps={{ color: 'blue.5', type: 'bars' }}
							/>
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
										aspectRatio: '1',
										border: selectedId === null ? "1px solid #228be6" : undefined,
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										justifyContent: "center",
										textAlign: "center",
									}}
								>
									<Title fz={{ base: "sm", sm: "lg", lg: "sm" }}>Без компании</Title>
									<Text size="xs" color="dimmed" mt="xs">
										Частное лицо
									</Text>
								</Card>
							</SimpleGrid>
						)}

						{error && <Text c="red" size="sm">{error}</Text>}

						<Group justify="right" mt="md">
							<Button onClick={handleNext} disabled={selectedId === undefined} size="md" radius='md'>
								Далее
							</Button>
						</Group>
					</Stack>
				) : (
					<Stack gap="md">
						<Title fz={{ base: "24px", sm: "26px" }}>Заполните обязательные поля</Title>

						<SimpleGrid
							cols={{ base: 1, sm: 2, md: 3 }}
							spacing={{ base: 'sm', sm: 'md' }}
							verticalSpacing="md"
						>
							<TextInput
								radius="md"
								label="Фамилия"
								placeholder="Например, Иванов"
								value={lastName}
								required
								onChange={(e) => setLastName(e.currentTarget.value)}
							/>
							<TextInput
								radius="md"
								label="Имя"
								placeholder="Например, Владимир"
								value={firstName}
								required
								onChange={(e) => setFirstName(e.currentTarget.value)}
							/>
							<TextInput
								radius="md"
								label="Отчество"
								placeholder="(не обязательно)"
								value={patronymic}
								onChange={(e) => setPatronymic(e.currentTarget.value)}
							/>
							<Input.Wrapper label="Телефон" required>
								<Input
									size="sm"
									radius="md"
									value={phone}
									required
									placeholder="+7 (800) 123-45-67"
									onChange={(e) => setPhone(e.currentTarget.value)}
									component={IMaskInput}
									mask="+7 (000) 000-00-00"
								/>
							</Input.Wrapper>
							<DatePickerInput
								locale="ru"
								label="Дата рождения"
								placeholder="Нажмите для выбора даты"
								radius="md"
								clearable
								value={birthday}
								required
								onChange={handleBirthdayChange as (value: any) => void}
							/>
							<CityPicker
								value={city}
								onChange={(value) => setCity(value)}
							/>
						</SimpleGrid>

						{error && <Text c="red" size="sm">{error}</Text>}

						<Group justify="space-between" mt="md">
							<Button size="md" variant="default" radius="md" onClick={handleBack}>Назад</Button>
							<Button size="md" onClick={handleSubmit} radius="md" disabled={!isValid}>Завершить</Button>
						</Group>
					</Stack>
				)}
			</Paper>
		</Container>
	);
}