import {
	Button,
	Card,
	Center,
	CloseButton,
	Container,
	Group,
	Input,
	Loader,
	SimpleGrid,
	Stack,
	Text,
	TextInput,
	Title
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { modals } from "@mantine/modals";
import { IconAlertSquareRounded, IconChevronRight, IconSearch } from "@tabler/icons-react";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BASE_IMAGE_URL, BASE_URL } from "../../constants";
import { companyService } from "../../services/companyService";
import type { Company } from "../../types/company";

export function RegComplete() {
	const [step, setStep] = useState(1);
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [patronymic, setPatronymic] = useState("");
	const [phone, setPhone] = useState("");
	const [birthday, setBirthday] = useState<Date | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");

	const [showAgeWarning, setShowAgeWarning] = useState(false);

	const [companies, setCompanies] = useState<Company[]>([]);
	const [loading, setLoading] = useState(true);

	const location = useLocation();
	const email = location.state?.email;

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

	const filteredCompanies = companies.filter((company) =>
		company.name.toLowerCase().includes(searchQuery.toLowerCase())
	);


	// хелпер: проверить, есть ли 18 лет
	const is18OrOlder = (date: Date) => {
		const now = new Date();
		const birthDate = new Date(date);
		const age = now.getFullYear() - birthDate.getFullYear();
		const m = now.getMonth() - birthDate.getMonth();
		return age > 18 || (age === 18 && m >= 0 && now.getDate() >= birthDate.getDate());
	};

	// обработчик даты
	const handleBirthdayChange = (value: Date | null) => {
		setBirthday(value);
		if (value && !is18OrOlder(value)) {
			setShowAgeWarning(true);
			modals.open({
				title: 'Возрастное ограничение',
				centered: true,
				radius: "lg",
				children: (
					<Center>
						<Group>
							<IconAlertSquareRounded color="red" size={45}></IconAlertSquareRounded>
							<Text style={{width: '85%'}}>
								Для регистрации вам должно быть не менее 18 лет. Пожалуйста, укажите корректную дату рождения.
							</Text>
						</Group>
					</Center>
				),
			});
		} else {
			setShowAgeWarning(false);
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
		setError(null);
		setStep(1);
	};

	const handleSubmit = async () => {
		if (!firstName || !lastName || !phone || !birthday) return;

		setError(null);
		try {
			await axios.post(
				BASE_URL + "api/auth/complete-registration",
				{
					email,
					first_name: firstName,
					last_name: lastName,
					patronymic,
					phone_number: phone,
					birthday: dayjs(birthday).format("YYYY-MM-DD"),
					company_id: selectedId,
				},
				{ withCredentials: true }
			);
			window.location.href = "/dashboard";
		} catch (err) {
			console.error(err);
			setError("Не удалось завершить регистрацию. Попробуйте позже.");
		}
	};

	const isStep1Valid = selectedId !== undefined;
	const isStep2Valid =
		firstName.trim() && lastName.trim() && phone.trim() && birthday;

	return (
		<Container size="lg" py="xl">
			{step === 1 ? (
				<Stack gap="xl">
					<Title order={2}>Выберите компанию</Title>

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
								aria-label="Clear input"
								onClick={() => setSearchQuery('')}
								style={{ display: searchQuery ? undefined : 'none' }}
							/>
						}
					/>


					{
						loading ? (
							<Loader />
						) : (
							<SimpleGrid
								cols={5}
								spacing="lg"
							>
								{filteredCompanies.map((company) => (
									<Card
										key={company.id}
										shadow="sm"
										radius="xl"
										withBorder
										onClick={() => setSelectedId(company.id)}
										style={{
											cursor: "pointer",
											border:
												selectedId === company.id
													? "2px solid #228be6"
													: undefined,
											transition: "border-color 0.2s ease",
											width: 200,
											height: 200,
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											justifyContent: "center",
											textAlign: "center",
										}}
									>
										<img
											src={BASE_IMAGE_URL + "companies/" + company.image_url}
											alt={company.name}
											style={{
												width: 120,
												height: 120,
												objectFit: "contain",
											}}
										/>
										<Title order={5}>{company.name}</Title>
									</Card>
								))}

								{/* Без компании */}
								<Card
									shadow="sm"
									radius="xl"
									bg="gray.2"
									withBorder
									onClick={() => setSelectedId(null)}
									style={{
										cursor: "pointer",
										border:
											selectedId === null ? "2px solid #228be6" : undefined,
										transition: "border-color 0.2s ease",
										width: 200,
										height: 200,
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										justifyContent: "center",
										textAlign: "center",
									}}
								>
									<Title order={5}>Без компании</Title>
									<Text size="xs" color="dimmed" mt="xs">
										Частное лицо
									</Text>
								</Card>
							</SimpleGrid>
						)}

					{error && (
						<Text c="red" size="sm">
							{error}
						</Text>
					)}

					<Group justify="right" mt="md">
						<Button onClick={handleNext} disabled={!isStep1Valid} size="lg" radius="md" mb="xl" rightSection={<IconChevronRight></IconChevronRight>}>
							Продолжить
						</Button>
					</Group>
				</Stack>
			) : (
				<Stack gap="xl">
					<Title order={2}>Введите ваши данные</Title>

					<SimpleGrid spacing="lg" cols={3}>
						<TextInput
							label="Фамилия"
							value={lastName}
							onChange={(e) => setLastName(e.currentTarget.value)}
							required
							size="md"
							radius="md"
						/>
						<TextInput
							label="Имя"
							value={firstName}
							onChange={(e) => setFirstName(e.currentTarget.value)}
							required
							radius="md"
							size="md"
						/>
						<TextInput
							label="Отчество"
							value={patronymic}
							onChange={(e) => setPatronymic(e.currentTarget.value)}
							radius="md"
							size="md"
						/>
						<TextInput
							label="Телефон"
							placeholder="+7 999 123-45-67"
							value={phone}
							onChange={(e) => setPhone(e.currentTarget.value)}
							radius="md"
							required
							size="md"
						/>
					</SimpleGrid>

					<DatePickerInput
						valueFormat="DD.MM.YYYY"
						label="Дата рождения"
						placeholder="ДД.ММ.ГГГГ"
						value={birthday}
						onChange={handleBirthdayChange as (value: any) => void}
						maxDate={new Date()}
						size="md"
						required
						error={showAgeWarning ? "Вам должно быть не менее 18 лет" : false}
					/>

					{error && (
						<Text c="red" size="sm">
							{error}
						</Text>
					)}

					<Group justify="space-between" mt="md">
						<Button variant="outline" onClick={handleBack} size="lg" radius="md">
							Назад
						</Button>
						<Button  onClick={handleSubmit} disabled={!isStep2Valid || showAgeWarning} size="lg" radius="md">
							Завершить регистрацию
						</Button>
					</Group>
				</Stack>

			)}
		</Container>
	);
}