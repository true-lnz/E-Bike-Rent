import { Button, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { sendArrivalNotification } from '../services/feedbackService';
import type { User } from '../types/user';

interface ArrivalNotifyButtonProps {
	user: User;
}

export function ArrivalNotifyButton({ user }: ArrivalNotifyButtonProps) {
	const [loading, { toggle }] = useDisclosure();
	const [modalOpened, setModalOpened] = useState(false);

	const handleClick = async () => {
		toggle();
		const response = await sendArrivalNotification(user);

		setTimeout(() => {
			toggle();
				setModalOpened(true);

			if (!response.error) {
			} else {
				console.error(response.error);
			}
		}, 3000);
	};

	return (
		<>
			<Button
				color="blue.7"
				radius="xl"
				size="md"
				loading={loading}
				onClick={handleClick}
			>
				Уведомить о поступлении
			</Button>

			<Modal
				opened={modalOpened}
				onClose={() => setModalOpened(false)}
				title="Заявка отправлена"
				radius="lg"
				centered
			>
				<Text span color='blue.7'>Спасибо!</Text> Мы уведомим вас, когда электровелосипеды будут доступны.
			</Modal>
		</>
	);
}