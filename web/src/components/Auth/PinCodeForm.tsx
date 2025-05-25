import {
	Button,
	Card,
	Center,
	PinInput,
	rem,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PinCodeForm() {
	const [timer, setTimer] = useState(60);
	const [showResendButton, setShowResendButton] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const location = useLocation();
	const navigate = useNavigate();
	const email = location.state?.email;

	useEffect(() => {
		if (!email) {
			// Если пользователь пришел без email — вернуть на первый этап
			navigate("/auth");
		}
	}, [email, navigate]);

	// Таймер
	useEffect(() => {
		if (showResendButton) return;

		const interval = setInterval(() => {
			setTimer((prev) => {
				if (prev === 1) {
					clearInterval(interval);
					setShowResendButton(true);
				}
				return prev > 0 ? prev - 1 : 0;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [showResendButton]);

	// Подтверждение кода
	const handleCodeComplete = async (code: string) => {
		setLoading(true);
		setError(null);

		try {
			const res = await axios.post("http://localhost:8080/auth/login/verify-code", {
				email,
				code,
			});

			// TODO: сохранить токен, перейти в личный кабинет и т.п.
			console.log("Код подтвержден, пользователь:", res.data);
			navigate("/dashboard");
		} catch (err: any) {
			console.error(err);
			setError("Неверный код. Попробуйте ещё раз.");
		} finally {
			setLoading(false);
		}
	};

	// Повторная отправка кода
	const handleResendCode = async () => {
		setShowResendButton(false);
		setTimer(60);
		setError(null);

		try {
			await axios.post("http://localhost:8080/auth/login/send-code", { email });
		} catch (err) {
			console.error("Ошибка при повторной отправке кода", err);
			setError("Не удалось отправить код. Попробуйте позже.");
			setShowResendButton(true);
		}
	};

	return (
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
							onComplete={handleCodeComplete}
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
	);
}
