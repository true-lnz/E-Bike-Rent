import {
	Button,
	Card,
	Center,
	PinInput,
	rem,
	Stack,
	Text,
	Title,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { sendCode, verifyCode } from '../../services/authService';

export default function CodeStep({ onNext }: { onNext: () => void }) {
	const [code, setCode] = useState('');
	const { email, setIsVerified } = useAuth();
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const [timer, setTimer] = useState(60);
	const [showResendButton, setShowResendButton] = useState(false);

	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (timer > 0) {
			interval = setInterval(() => {
				setTimer((prev) => prev - 1);
			}, 1000);
		} else {
			setShowResendButton(true);
		}
		return () => clearInterval(interval);
	}, [timer]);

	const handleSubmit = async () => {
		setLoading(true);
		setError('');
		try {
			const res = await verifyCode(email, code);
			if (!res.data.is_verified) {
				setIsVerified(false);
				onNext();
			} else {
				setIsVerified(true);
				if (res.data.role === 'admin') {
					window.location.href = '/admin';
				} else {
					window.location.href = '/dashboard';
				}
			}
		} catch {
			setError('Неверный код');
		} finally {
			setLoading(false);
		}
	};

	const handleResendCode = async () => {
		setLoading(true);
		setError('');
		try {
			await sendCode(email);
			setShowResendButton(false);
			setTimer(60); // сбрасываем таймер
		} catch {
			setError('Не удалось отправить код повторно');
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Center h="72vh">
				<Card withBorder shadow="sm" padding={rem(45)} radius="lg" w={500}>
					<Stack gap="md">
						{/* Заголовки */}
						<Stack gap={rem(4)}>
							<Title order={1} ta="center">
								Код подтверждения отправлен на почту
							</Title>

							<Text size="xs" c="dimmed" ta="center">
								Введи его ниже, чтобы продолжить. Если письмо не пришло,
								проверь папку "Спам" или запроси новый код.
							</Text>
						</Stack>

						{/* Поле PIN-кода */}
						<Center>
							<PinInput
								length={4}
								size="lg"
								oneTimeCode
								disabled={loading}
								value={code}
								onChange={setCode}
								onComplete={handleSubmit}
							/>
						</Center>

						{/* Ошибка */}
						{error && (
							<Text size="sm" c="red" ta="center">
								{error}
							</Text>
						)}

						{/* Таймер или кнопка */}
						{!showResendButton ? (
							<Text size="xs" c="dimmed" ta="center">
								Получить новый код можно через <strong>{timer} сек.</strong>
							</Text>
						) : (
							<Button
								color="gray.3"
								c="dark.9"
								fw={700}
								radius="xl"
								size="md"
								fullWidth
								onClick={handleResendCode}
								disabled={loading}
							>
								Отправить код повторно
							</Button>
						)}
					</Stack>
				</Card>
			</Center>
		</>
	);
}
