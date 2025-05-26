import {
	Button,
	Grid,
	Loader,
	ScrollArea,
	Stack,
	TextInput,
	Title,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { companyService } from "../../services/companyService";
import type { Company } from "../../types/Company";
import CompanyCard from "../CompanyCard";

export function RegComplete() {
	const [companies, setCompanies] = useState<Company[]>([]);
	const [selectedId, setSelectedId] = useState<number | null>(null);

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [patronymic, setPatronymic] = useState("");
	const [phone, setPhone] = useState("");
	const [birthday, setBirthday] = useState<Date | null>(null);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const navigate = useNavigate();
	const location = useLocation();
	const email = location.state?.email;

	useEffect(() => {
		if (!email) navigate("/auth");
	}, [email, navigate]);

	useEffect(() => {
		companyService
			.getAll()
			.then(setCompanies)
			.finally(() => setLoading(false));
	}, []);

	const handleSubmit = async () => {
		if (!firstName || !lastName || !phone || !birthday) return;

		setError(null);
		try {
			await axios.post(
				"http://localhost:8080/api/auth/complete-registration",
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

			navigate("/dashboard");
		} catch (err) {
			console.error(err);
			setError("Не удалось завершить регистрацию. Попробуйте позже.");
		}
	};

	const isValid =
		firstName.trim() &&
		lastName.trim() &&
		phone.trim() &&
		birthday &&
		!!email;

	return (
		<Stack p="lg" align="stretch" gap="lg">
			<Title order={2}>Заверши регистрацию</Title>

			{loading ? (
				<Loader />
			) : (
				<>
					<TextInput
						label="Фамилия"
						value={lastName}
						onChange={(e) => setLastName(e.currentTarget.value)}
						required
					/>
					<TextInput
						label="Имя"
						value={firstName}
						onChange={(e) => setFirstName(e.currentTarget.value)}
						required
					/>
					<TextInput
						label="Отчество"
						value={patronymic}
						onChange={(e) => setPatronymic(e.currentTarget.value)}
					/>
					<TextInput
						label="Телефон"
						placeholder="+7 999 123-45-67"
						value={phone}
						onChange={(e) => setPhone(e.currentTarget.value)}
						required
					/>
					<DatePicker
						value={birthday}
						onChange={(value) => {
							const date = value ? new Date(value) : null;
							setBirthday(date);
						}}
/* 						label="Дата рождения"
						placeholder="Выберите дату"
						required */
						maxDate={new Date()}
					/>


					<Title order={4}>Выбери компанию</Title>
					<ScrollArea h={300}>
						<Grid gutter="md">
							{companies.map((company) => (
								<Grid.Col span={{ base: 6, sm: 4, md: 3 }} key={company.id}>
									<CompanyCard
										company={company}
										selected={selectedId === company.id}
										onSelect={setSelectedId}
									/>
								</Grid.Col>
							))}
						</Grid>
					</ScrollArea>

					{error && (
						<div style={{ color: "red", textAlign: "center" }}>{error}</div>
					)}

					<Button
						disabled={!isValid}
						radius="xl"
						fullWidth
						onClick={handleSubmit}
					>
						Завершить регистрацию
					</Button>
				</>
			)}
		</Stack>
	);
}
