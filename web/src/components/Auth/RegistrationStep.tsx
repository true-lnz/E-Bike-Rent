import {
	Button,
	Card,
	Center,
	CloseButton,
	Container,
	Group,
	Input,
	Loader,
	Paper,
	SimpleGrid,
	Stack,
	Text,
	TextInput,
	Title
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { modals } from "@mantine/modals";
import { IconAlertSquareRounded, IconSearch } from "@tabler/icons-react";
import dayjs from "dayjs";
import 'dayjs/locale/ru';
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { completeRegistration } from "../../services/authService";
import { companyService } from "../../services/companyService";
import type { Company } from "../../types/company";
import CompanyCard from "../CompanyCard";
import { PhoneInput } from "./PhoneInput";

export default function RegistrationStep() {
	const { email } = useAuth();
	const [step, setStep] = useState(1);
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [patronymic, setPatronymic] = useState("");
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
			birthday !== null
		);
	}, [firstName, lastName, phone, birthday]);

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
		if (!firstName || !lastName || !phone || !birthday) return;

		const modalId = modals.open({
			title: 'Регистрация',
			centered: true,
			withCloseButton: false,
			radius: 'md',
			children: (
				<Center>
					<Loader size="sm" />
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
				company_id: selectedId,
			});

			modals.updateModal({
				modalId,
				title: 'Регистрация успешна',
				withCloseButton: true,
				radius: 'md',
				children: (
					<Stack gap="md">
						<Text>Вы успешно зарегистрированы!</Text>
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
					<Stack gap="md">
						<Text c="red">Произошла ошибка при регистрации. Попробуйте позже.</Text>
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
									aria-label="Очистить"
									onClick={() => setSearchQuery("")}
									style={{ display: searchQuery ? undefined : "none" }}
								/>
							}
						/>

						{loading ? (
							<Loader />
						) : (
							<SimpleGrid cols={5} spacing="lg">
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
										border: selectedId === null ? "1px solid #228be6" : undefined,
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

						{error && <Text c="red" size="sm">{error}</Text>}

						<Group justify="right" mt="md">
							<Button onClick={handleNext} disabled={selectedId === undefined} size="md" radius='md'>
								Далее
							</Button>
						</Group>
					</Stack>
				) : (
					<Stack gap="md">
						<Title order={2}>Заполните данные</Title>

						<SimpleGrid
							cols={{ base: 1, sm: 2, md: 3 }}
							spacing={{ base: 'sm', sm: 'md' }}
							verticalSpacing="md"
						>
							<TextInput
								radius="md"
								label="Фамилия"
								value={lastName}
								required
								onChange={(e) => setLastName(e.currentTarget.value)}
							/>
							<TextInput
								radius="md"
								label="Имя"
								value={firstName}
								required
								onChange={(e) => setFirstName(e.currentTarget.value)}
							/>
							<TextInput
								radius="md"
								label="Отчество"
								value={patronymic}
								onChange={(e) => setPatronymic(e.currentTarget.value)}
							/>
						</SimpleGrid>


						<SimpleGrid
							cols={{ base: 1, sm: 2 }}
							spacing={{ base: 'sm', sm: 'md' }}
							verticalSpacing="md"
						>
							<TextInput
								label="Телефон"
								radius="md"
								size="sm"
								value={phone}
								required
								onChange={(e) => setPhone(e.currentTarget.value)}
								component={PhoneInput}
							/>
							<DatePickerInput
								locale="ru"
								label="Дата рождения"
								radius="md"
								value={birthday}
								required
								onChange={handleBirthdayChange as (value: any) => void}
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