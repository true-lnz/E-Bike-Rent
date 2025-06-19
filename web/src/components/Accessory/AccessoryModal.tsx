import {
	Button,
	Group,
	Modal,
	Stack,
	Text,
} from "@mantine/core";

import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { sendFeedback } from "../../services/feedbackService";
import AccessorySelectCardList from "./AccessorySelectCardList";

interface Props {
	opened: boolean;
	onClose: () => void;
	rentId?: number;
	initialAccessoryIds?: number[]; // новые пропсы, можно передавать "уже добавленные"
}

export default function AccessoryModal({
	opened,
	onClose,
	rentId,
	initialAccessoryIds = [],
}: Props) {
	const { user } = useAuth();
	const [selected, setSelected] = useState<number[]>([]);
	const [submitting, setSubmitting] = useState(false);
	const [successModalOpen, setSuccessModalOpen] = useState(false);

	useEffect(() => {
		if (opened) {
			setSelected(initialAccessoryIds);
		} else {
			setSelected([]);
			setSuccessModalOpen(false);
		}
	}, [opened, initialAccessoryIds]);

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

		const hasNewSelection = selected.some(id => !initialAccessoryIds.includes(id));

		if (!hasNewSelection) {
			showNotification({
				title: "Не выбраны новые аксессуары",
				message: "Пожалуйста, выберите хотя бы один новый аксессуар",
				color: "red",
				radius: 'md',
				icon: <IconX size={16} />,
			});
			return;
		}

		setSubmitting(true);

		const fullName = `${user.last_name} ${user.first_name} ${user.patronymic}`;
		const text = `
Пользователь запросил добавление аксессуаров к аренде №${rentId}

👤 ФИО: ${fullName}
📧 Email: ${user.email}
📞 Телефон: ${user.phone_number}
🛠 Выбранные аксессуары (ID): ${selected.join(", ") || "—"}
`.trim();

		try {
			const response = await sendFeedback({
				phoneNumber: user.phone_number,
				text,
			});

			if (!response.error) {
				showNotification({
					title: "Запрос отправлен",
					message: "Скоро с вами свяжется оператор для уточнения информации",
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
			window.scrollTo({ top: 0, behavior: "smooth" });
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<>
			<Modal
				opened={opened}
				onClose={onClose}
				title="Добавить аксессуары"
				size="lg"
				radius="lg"
				centered
			>
				<Stack gap="md" my="4">
					<AccessorySelectCardList
						selectedAccessories={selected}
						lockedAccessories={initialAccessoryIds}
						onChangeSelected={setSelected}
					/>
					<Group mt="sm" align="end" gap="xs" justify="flex-end">
						<Button variant="default" onClick={onClose} radius="md" disabled={submitting}>
							Отмена
						</Button>
						<Button
							onClick={handleSubmit}
							loading={submitting}
							radius="md"
							disabled={selected.length === 0 || submitting}
						>
							Выбрать
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
				<Text>Отлично! Скоро с вами свяжется менеджер для уточнения информации.</Text>
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
			</Modal>
		</>
	);
}