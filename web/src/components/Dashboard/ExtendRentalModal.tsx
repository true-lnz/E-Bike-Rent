import {
	Button,
	Group,
	Modal,
	NumberInput,
	Stack,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { sendFeedback } from "../../services/feedbackService";

interface Props {
	opened: boolean;
	onClose: () => void;
	rentId?: number;
}

export default function ExtendRentalModal({ opened, onClose, rentId }: Props) {
	const { user } = useAuth();
	const [days, setDays] = useState<number | ''>('');
	const [submitting, setSubmitting] = useState(false);
	const [successModalOpen, setSuccessModalOpen] = useState(false);

	useEffect(() => {
		if (!opened) {
			setDays('');
			setSuccessModalOpen(false);
		}
	}, [opened]);

	const handleSubmit = async () => {
		if (!user) {
			showNotification({
				title: "Ошибка",
				message: "Пользователь не авторизован",
				color: "red",
				radius: 'md',
				icon: <IconX size={16} />,
			});
			return;
		}

		if (!days || days <= 0) {
			showNotification({
				title: "Некорректное значение",
				message: "Введите положительное количество дней",
				color: "red",
				radius: 'md',
				icon: <IconX size={16} />,
			});
			return;
		}

		setSubmitting(true);

		const fullName = `${user.last_name} ${user.first_name} ${user.patronymic}`;
		const text = `
			Пользователь запросил продление аренды №${rentId}

			👤 ФИО: ${fullName}
			📧 Email: ${user.email}
			📞 Телефон: ${user.phone_number}
			📅 Желаемое продление: ${days} ${days === 1 ? 'день' : (days >= 2 && days <= 4 ? 'дня' : 'дней')}
			`.trim();

		try {
			const response = await sendFeedback({
				phoneNumber: user.phone_number,
				text,
			});

			if (!response.error) {
				showNotification({
					title: "Запрос отправлен",
					message: "Мы получили ваш запрос на продление аренды",
					color: "green",
					radius: 'md',
					icon: <IconCheck size={16} />,
				});
				setSuccessModalOpen(true);
			} else {
				throw new Error(response.error);
			}
		} catch (error) {
			showNotification({
				title: "Ошибка",
				radius: 'md',
				message: "Не удалось отправить запрос. Попробуйте позже.",
				color: "red",
				icon: <IconX size={16} />,
			});
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<>
			<Modal opened={opened} onClose={onClose} title="Продлить аренду" size="lg" radius="lg" centered>
				<Stack gap="md">
					<NumberInput
						label="Количество дней продления"
						placeholder="Например, 3"
						min={1}
						value={days}
						onChange={(value) => setDays(typeof value === "number" ? value : '')}
					/>
					<Group mt="sm" align="end" gap="xs" justify="flex-end">
						<Button variant="default" onClick={onClose} radius="md" disabled={submitting}>
							Отмена
						</Button>
						<Button
							onClick={handleSubmit}
							loading={submitting}
							radius="md"
							disabled={!days || submitting}
						>
							Продлить
						</Button>
					</Group>
				</Stack>
			</Modal>

			<Modal
				opened={successModalOpen}
				onClose={() => {
					setSuccessModalOpen(false);
					onClose();
				}}
				title="Запрос отправлен"
				centered
				size="sm"
				radius="lg"
				withCloseButton={false}
			>
				<Stack>
					<p>Спасибо! Мы получили ваш запрос на продление аренды. С вами свяжется оператор.</p>
					<Button
						fullWidth
						mt="md"
						radius="md"
						onClick={() => {
							setSuccessModalOpen(false);
							onClose();
						}}
					>
						Закрыть
					</Button>
				</Stack>
			</Modal>
		</>
	);
}
