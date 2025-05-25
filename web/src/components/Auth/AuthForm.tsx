import {
	Button,
	Card,
	Center,
	rem,
	Stack,
	Text,
	TextInput,
	Title
} from "@mantine/core";
import { useState } from "react";
import { Link } from "react-router-dom";
import { validateEmail } from "../../utils/validateEmail";

export default function AuthForm() {
	const [email, setEmail] = useState("");
	const [touched, setTouched] = useState(false);

	const isValid = validateEmail(email);

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
						onChange={(event) => setEmail(event.currentTarget.value)}
						onBlur={() => setTouched(true)}
						error={touched && !isValid ? "Введите корректную почту" : null}
						required
					/>

					<Button
						c="dark.9"
						color="gray.3"
						fw={700}
						radius="xl"
						size="md"
						fullWidth
						disabled={!isValid}
						onClick={() => {
							// здесь будет логика отправки запроса
							console.log("Отправка кода на:", email);
						}}
					>
						Получить код
					</Button>

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
