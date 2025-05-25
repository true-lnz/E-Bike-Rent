import {
	Button,
	Card,
	Center,
	rem,
	Stack,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/validateEmail";

export default function AuthForm() {
	const [email, setEmail] = useState("");
	const [touched, setTouched] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const navigate = useNavigate();

	const isValid = validateEmail(email);

	const handleSubmit = async () => {
		setTouched(true);
		setError(null);

		if (!isValid) return;

		setLoading(true);

		try {
			await axios.post("http://localhost:8080/api/auth/login/send-code", { email });

			// Успешно — переход ко второму шагу
			navigate("/auth/code", { state: { email } });
		} catch (err: any) {
			console.error(err);
			setError("Не удалось отправить код. Проверь адрес почты или попробуй позже.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Center h="72vh">
			<Card withBorder shadow="sm" padding={rem(45)} radius="lg" w={420}>
				<Stack gap="md">
					<Stack gap={rem(4)}>
						<Title order={1} ta="center">
							Введи почту
						</Title>

						<Text size="xs" c="dimmed" ta="center">
							Для входа в личный кабинет
						</Text>
					</Stack>

					<TextInput
						label="Почта"
						placeholder="ivanov@mail.ru"
						type="email"
						variant="filled"
						radius="md"
						size="md"
						value={email}
						onChange={(e) => setEmail(e.currentTarget.value)}
						onBlur={() => setTouched(true)}
						error={touched && !isValid ? "Введите корректную почту" : null}
						required
						disabled={loading}
					/>

					<Button
						c="dark.9"
						color="gray.3"
						fw={700}
						radius="xl"
						size="md"
						fullWidth
						disabled={!isValid || loading}
						onClick={handleSubmit}
					>
						Получить код
					</Button>

					{error && (
						<Text size="sm" c="red" ta="center">
							{error}
						</Text>
					)}

					<Text size="xs" c="dimmed" ta="center" mt="xs">
						Вводя адрес электронной почты, ты соглашаешься с{" "}
						<Text span inherit c="dimmed" component={Link} to="/policy" fw={500}>
							Политикой Конфиденциальности
						</Text>{" "}
						и даешь{" "}
						<Text span inherit c="dimmed" component={Link} to="/policy" fw={500}>
							Согласие на обработку персональных данных
						</Text>
					</Text>
				</Stack>
			</Card>
		</Center>
	);
}