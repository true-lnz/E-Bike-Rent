import {
	Anchor,
	Box,
	Button,
	Card,
	Container,
	Grid,
	Group,
	Image,
	Input,
	Notification,
	Stack,
	Text,
	Textarea,
	Title,
	rem,
} from '@mantine/core';
import { IMaskInput } from 'react-imask';
import {
	IconBolt,
	IconBrandTelegram,
	IconCheck,
	IconDeviceDesktopCog,
	IconMail,
	IconMapPin,
	IconPhone,
	IconSettings,
	IconTool,
	IconX,
} from '@tabler/icons-react';
import { useState } from 'react';
import { useForm } from '@mantine/form';
import logo from '../../assets/images/Logo512x512.png';
import { sendFeedback } from '../../services/feedbackService';

export default function Contacts() {
	const [notification, setNotification] = useState<{
		show: boolean;
		success: boolean;
		message: string;
	} | null>(null);
	const [loading, setLoading] = useState(false);

	const form = useForm({
		initialValues: {
			phone: '',
			message: '',
		},
		validate: {
			phone: (value) => {
				const digits = value.replace(/\D/g, '');
				if (digits.length !== 11) return 'Введите корректный номер телефона';
				return null;
			},
			message: (value) => (value.trim().length === 0 ? 'Введите сообщение' : null),
		},
	});

	const handleSubmit = async (values: typeof form.values) => {
		setLoading(true);
		try {
			await sendFeedback({
				phoneNumber: values.phone,
				text: values.message,
			});
			setNotification({
				show: true,
				success: true,
				message: 'Сообщение отправлено! Мы свяжемся с вами в ближайшее время',
			});
			form.reset();
		} catch {
			setNotification({
				show: true,
				success: false,
				message: 'Ошибка при отправке. Пожалуйста, попробуйте позже',
			});
		} finally {
			setLoading(false);
			setTimeout(() => setNotification(null), 5000);
		}
	};

	return (
		<Container size="lg" py="xl">
			{notification && (
				<Notification
					icon={notification.success ? <IconCheck size={18} /> : <IconX size={18} />}
					color={notification.success ? 'teal' : 'red'}
					title={notification.success ? 'Успешно!' : 'Ошибка'}
					onClose={() => setNotification(null)}
					mt="md"
					mb="md"
					radius="lg"
					withBorder
				>
					{notification.message}
				</Notification>
			)}

			<Title order={2} mb="lg">
				Контактная информация
			</Title>

			<Grid gutter="xl">
				<Grid.Col span={{ base: 12, md: 5 }}>
					<Card shadow="sm" radius="xl" p="xl" mb="md" withBorder bg="orange.5" c="white">
						<Stack gap="sm">
							<Group align="center">
								<Box style={{ backgroundColor: 'white', padding: '13px', borderRadius: '9999px' }}>
									<Image src={logo} alt="FulGaz logo" w={60} h={60} />
								</Box>
								<Text fw={700} fz={40}>«ФулГаз»</Text>
							</Group>

							<Stack gap={4} mt="xs">
								<Group gap="xs" wrap="nowrap">
									<IconMail size={18} />
									<Anchor href="mailto:thebearonegey@gmail.com" underline="never" c="white">
										<Text size="md"><b>Почта:</b> thebearonegey@gmail.com</Text>
									</Anchor>
								</Group>
								<Group gap="xs">
									<IconPhone size={18} />
									<Anchor href="tel:+79047382666" underline="never" c="white">
										<Text size="md"><b>Телефон:</b> +7 (904) 738-26-66</Text>
									</Anchor>
								</Group>
								<Group gap="xs" wrap="nowrap">
									<IconBrandTelegram size={18} />
									<Anchor href="https://t.me/FulGaz_Ufa" underline="never" c="white">
										<Text size="md"><b>Менеджер:</b> @FulGaz_Ufa</Text>
									</Anchor>
								</Group>
							</Stack>
						</Stack>
					</Card>

					<Card shadow="sm" radius="xl" p="xl" mb="md" withBorder>
						<Group gap="xs" mb="xs">
							<IconMapPin size={20} />
							<Text fw={600} fz="lg">Адрес</Text>
						</Group>
						<Text size="sm">Республика Башкортостан, г. Уфа</Text>
						<Text size="sm" c="dimmed">Еще более точный адрес</Text>
					</Card>

					<Card shadow="sm" radius="xl" p="xl" withBorder>
						<Text fw={600} fz="lg" mb="sm">Услуги</Text>
						<Stack gap="xs">
							<Group gap="xs" wrap="nowrap">
								<IconBolt size={18} />
								<Text size="sm">Сдача в аренду электровелосипедов</Text>
							</Group>
							<Group gap="xs" wrap="nowrap">
								<IconTool size={18} />
								<Text size="sm">Ремонт и обслуживание велосипедов</Text>
							</Group>
							<Group gap="xs" wrap="nowrap">
								<IconDeviceDesktopCog size={18} />
								<Text size="sm">Прошивка ПО электровелосипедов</Text>
							</Group>
							<Group gap="xs" wrap="nowrap">
								<IconSettings size={18} />
								<Text size="sm">Диагностика электросистем велосипедов</Text>
							</Group>
						</Stack>
					</Card>
				</Grid.Col>

				<Grid.Col span={{ base: 12, md: 7 }}>
					<Card shadow="sm" radius="xl" p="md" mb="md" withBorder>
						<iframe
							src="https://yandex.ru/map-widget/v1/?um=constructor%3A3890c2713f646a1f6be1614c4c0cb09b2b715dba7c0d14c5ae80d1a47cdde1b8&amp;source=constructor"
							width="100%"
							height="300"
							style={{ border: 0, borderRadius: rem(20) }}
							loading="lazy"
							title="Карта Уфа"
						/>
					</Card>

					<Card shadow="sm" radius="xl" p="xl" withBorder>
						<Text fw={600} fz="lg" mb="sm">Форма обратной связи</Text>

						<form onSubmit={form.onSubmit(handleSubmit)}>
							<Textarea
								autosize
								minRows={6}
								maxRows={6}
								radius="md"
								placeholder="Какой у вас вопрос?"
								error={form.errors.message}
								{...form.getInputProps('message')}
							/>

							<Group mt="sm" grow>
								<Input
									component={IMaskInput}
									mask="+7 (000) 000-00-00"
									placeholder="Ваш телефон"
									radius="md"
									error={form.errors.phone}
									{...form.getInputProps('phone')}
								/>
								<Button type="submit" radius="md" color="blue.7" loading={loading}>
									Отправить
								</Button>
							</Group>
						</form>
					</Card>
				</Grid.Col>
			</Grid>
		</Container>
	);
}
