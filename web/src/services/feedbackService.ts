import axios from 'axios';
import { BASE_URL } from '../constants';
import type { FeedbackRequest, FeedbackResponse } from "../types/feedback";
import type { User } from "../types/user";

export const sendFeedback = async (data: FeedbackRequest): Promise<FeedbackResponse> => {
	try {
		const response = await axios.post<FeedbackResponse>(BASE_URL + 'api/feedback', {
			phone_number: data.phoneNumber,
			text: data.text
		}, {
			withCredentials: true,
		});

		return response.data;
	} catch (error) {
		console.error('Error sending feedback:', error);

		if (axios.isAxiosError(error)) {
			return {
				message: 'Failed to send feedback',
				error: error.response?.data?.error || error.message,
			};
		}

		return {
			message: 'Failed to send feedback',
			error: error instanceof Error ? error.message : 'Unknown error',
		};
	}
};

/**
 * Отправляет уведомление админу о поступлении электровелосипедов с данными пользователя
 */
export const sendArrivalNotification = async (user: User): Promise<FeedbackResponse> => {
  const fullName = `${user.last_name} ${user.first_name} ${user.patronymic}`;
  const birthDate = new Date(user.birthday).toLocaleDateString('ru-RU');

  const message = `
Пользователь просит уведомить о поступлении электровелосипедов.

👤 ФИО: ${fullName}
📅 Дата рождения: ${birthDate}
📧 Email: ${user.email}
📞 Телефон: ${user.phone_number}
🔐 Подтвержден: ${user.is_verified ? 'Да' : 'Нет'}
🏢 Компания: ${user.company?.name || '—'}
`.trim();

  return sendFeedback({
    phoneNumber: user.phone_number,
    text: message,
  });
};