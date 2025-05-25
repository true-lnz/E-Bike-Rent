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
import { Link } from "react-router-dom";

export default function AuthForm() {
	return (
		<Center >
			<Card withBorder shadow="sm" padding={rem(45)} radius="lg" w={420}>
				<Stack gap="md">
					<Stack gap={rem(.5)}>
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
						radius="md"
						size="md"
						required
					/>

					<Button color="dark.0" c="dark.9" fw={700} radius="xl" size="md" fullWidth>
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
