// src/auth/components/EmailStep.tsx
import { Avatar, Button, Card, Center, Divider, Group, rem, Stack, Text, TextInput, Title } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconChevronRight, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { logout, sendCode } from '../../services/authService';

const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export default function EmailStep({ onNext }: { onNext: () => void }) {
	const { user, setEmail, setUser, setIsVerified } = useAuth();
	const [loading, setLoading] = useState(false);
	const [touched, setTouched] = useState(false);
	const [input, setInput] = useState('');
	const [error, setError] = useState<string | null>(null);

	const isValid = validateEmail(input);

	const handleSubmit = async () => {
		setTouched(true);
		setLoading(true);
		setError(null);
		try {
			await sendCode(input);
			setEmail(input);
			setLoading(true);
			onNext();
		} catch {
			setLoading(false);
			setError("Не удалось отправить код. Проверь адрес почты или попробуй позже.");
			showNotification({
				title: "Ошибка",
				message: "Ошибка при отправке кода. Попробуйте позже",
				color: "red",
				radius: 'md',
				icon: <IconX size={16} />,
			});
		}
	};

	const handleLogout = () => {
		document.cookie = 'token=; Max-Age=0; path=/'; // удаляет cookie
		setUser(null);
		setEmail('');
		setIsVerified(false);
		logout();
		window.location.href = '/auth';
	};

	const fullName = user?.first_name + " " + user?.last_name;

	return (
		<Center h="72vh">
			<Card withBorder shadow="sm" padding={rem(45)} radius="lg" w={420}>
				<Stack gap="md">
					{user ? (
						<Stack>
							<Button
								variant='outline'
								radius="xl"
								size='xs'
								color="orange"
								rightSection={<IconChevronRight size={14} />}
								component={Link}
								to={'/dashboard'}
								style={{ alignSelf: 'flex-end' }}>
								Перейти в личный кабинет
							</Button>
							<Divider mt="md"></Divider>
							<Group>
								<Avatar c="dimmed" color="initials" name={fullName} />
								<Text>Вы уже вошли как: <strong>{fullName}</strong></Text>
							</Group>

							<Button
								c="dark.9"
								color="gray.3"
								fw={700}
								radius="xl"
								size="md"
								fullWidth
								onClick={handleLogout}
							>
								Войти в другой аккаунт
							</Button>
						</Stack>
					) : (
						<>
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
								value={input}
								onChange={e => setInput(e.target.value)}
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
								<Text span inherit c="dimmed" component={Link} to="/policy" target="_blank" fw={500}>
									Политикой Конфиденциальности
								</Text>{" "}
								и даешь{" "}
								<Text span inherit c="dimmed" component={Link} to="/policy" target="_blank" fw={500}>
									Согласие на обработку персональных данных
								</Text>
							</Text>
						</>
					)}
				</Stack>
			</Card>
		</Center>
	);
}
