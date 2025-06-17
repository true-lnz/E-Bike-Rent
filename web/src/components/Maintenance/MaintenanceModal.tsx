import {
	Alert,
	Button,
	Center,
	Checkbox,
	Combobox,
	Group,
	Input,
	Modal,
	Pill,
	PillsInput,
	Stack,
	Text,
	Textarea,
	TextInput,
	useCombobox,
} from "@mantine/core";
import { IconExclamationCircle, IconSquareCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";

type Props = {
	opened: boolean;
	onClose: () => void;
	onCreate: (form: { bicycle_name: string; details: string }) => Promise<void>;
	defaultTitle?: string;
	type: number;
};

const typeOptions: Record<number, string[]> = {
	1: [
		'Замена гидравлического тормоза (комплект, перед/зад) – 2700 ₽',
		'Ремонт гидролинии – 650 ₽',
		'Ручка тормоза + расширительный бачок – 1500 ₽',
		'Тормозной диск (гидравлика) – 900 ₽',
		'Колодки (пара) – 450 ₽'
	],
	2: [
		'Обод мотор-колеса – 3700 ₽',
		'Передний обод – 2700 ₽',
		'Ось мотор-колеса (статор) – 5000 ₽',
		'Усиленная вилка – 3400 ₽',
		'Подшипник вилки – 350 ₽',
		'Руль – 1400 ₽',
		'Стойка руля – 800 ₽',
		'Подседельный штырь – 700 ₽',
		'Седло – 800 ₽'
	],
	3: [
		'Контроллер 48-60V – 2600 ₽ ',
		'Кейс контроллера – 550 ₽',
		'Ручка газа – 1700 ₽',
		'Модуль света – 650 ₽'
	],
	4: [
		'Трещина рамы (сварка/замена) – 12000 ₽',
		'Цепь – 550 ₽',
		'Шатуны (комплект) – 800 ₽',
		'Бескамерная покрышка – 1400 ₽',
		'Прокол – 250 ₽',
		'Педали – 450 ₽',
		'Подножка – 1000 ₽',
		'Крылья (перед/зад) – по 800 ₽',
	],
	5: [
		'Крышка АКБ (верх/низ) – 1200/550 ₽',
		'Ремонт корпуса АКБ – 2300 ₽',
		'Замок зажигания (потеря ключа) – 550 ₽',
	],
	6: [
		'Вскрытие контроллера – 1400 ₽',
		'Ремонт корпуса АКБ – 2300 ₽',
		'Замок зажигания (потеря ключа) – 550 ₽',
	],
};

export function MaintenanceModal({
	opened,
	onClose,
	onCreate,
	defaultTitle = "",
	type,
}: Props) {
	const DETAILS_PREFIX = `${defaultTitle}: `;

	const [bicycleName, setBicycleName] = useState("");
	const [detailsSuffix, setDetailsSuffix] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState("");

	const currentOptions = typeOptions[type] ?? [];

	useEffect(() => {
		if (opened) {
			setSuccess(false);
			setError("");
			setBicycleName("");
			setDetailsSuffix("");
			setValue([]);
		}
	}, [opened]);

	useEffect(() => {
		setDetailsSuffix("");
	}, [defaultTitle]);

	const handleDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.currentTarget.value;

		if (!value.startsWith(DETAILS_PREFIX)) {
			setDetailsSuffix(value.slice(DETAILS_PREFIX.length));
		} else {
			setDetailsSuffix(value.slice(DETAILS_PREFIX.length));
		}
	};

	const handleSubmit = async () => {
		if (!bicycleName.trim() || !detailsSuffix.trim()) return;

		setLoading(true);
		setError("");

		try {
			await onCreate({
				bicycle_name: bicycleName.trim(),
				details: DETAILS_PREFIX + detailsSuffix.trim(),
			});
			setSuccess(true);
			setBicycleName("");
			setDetailsSuffix("");
		} catch (err: any) {
			setError("Произошла ошибка при отправке заявки. Попробуйте ещё раз.");
		} finally {
			setLoading(false);
		}
	};

	const combobox = useCombobox({
		onDropdownClose: () => combobox.resetSelectedOption(),
		onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
	});

	const [value, setValue] = useState<string[]>([]);

	const handleValueSelect = (val: string) => {
		setValue((current) => current.includes(val) ? current.filter((v) => v !== val) : [...current, val]
		);
		console.log(value);
	}

	const handleValueRemove = (val: string) =>
		setValue((current) => current.filter((v) => v !== val));

	const values = value.map((item) => (
		<Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
			{item}
		</Pill>
	));

	const options = currentOptions.map((item) => (
		<Combobox.Option value={item} key={item} active={value.includes(item)}>
			<Group gap="sm" wrap="nowrap">
				<Checkbox
					checked={value.includes(item)}
					onChange={() => { }}
					aria-hidden
					tabIndex={-1}
					style={{ pointerEvents: 'none' }}
				/>
				<span>{item}</span>
			</Group>
		</Combobox.Option>
	));

	return (
		<Modal
			size="lg"
			opened={opened}
			onClose={onClose}
			radius="lg"
			title="Новая заявка"
			centered
		>
			{success ? (
				<Center py="xl" style={{ textAlign: "center" }}>
					<Stack align="center" gap="md">
						<IconSquareCheck size={80} color="green" />
						<Text fw={600} size="xl">
							Заявка успешно отправлена!
						</Text>
						<Text c="dimmed" size="sm" ta="center" mx="md">
							Мы свяжемся с вами по номеру телефона, указанному в вашем профиле,
							в ближайшее время.
						</Text>
						<Button onClick={onClose} radius="xl" mt="sm">
							Закрыть
						</Button>
					</Stack>
				</Center>
			) : (
				<Stack>
					<TextInput
						label="Устройство"
						description="Укажите в этом поле название вашего электровелосипеда"
						radius="md"
						value={bicycleName}
						placeholder="Например, Kugoo V3 Pro"
						onChange={(e) => setBicycleName(e.currentTarget.value)}
						required
					/>
					<Combobox store={combobox} onOptionSubmit={handleValueSelect} withinPortal={false}>
						<Combobox.DropdownTarget>
							<PillsInput label="Выбор услуг" required pointer onClick={() => combobox.toggleDropdown()}>
								<Pill.Group>
									{values.length > 0 ? (
										values
									) : (
										<Input.Placeholder>Выберите перечень необходимых услуг</Input.Placeholder>
									)}

									<Combobox.EventsTarget>
										<PillsInput.Field
											type="hidden"
											onBlur={() => combobox.closeDropdown()}
											onKeyDown={(event) => {
												if (event.key === 'Backspace') {
													event.preventDefault();
													handleValueRemove(value[value.length - 1]);
												}
											}}
										/>
									</Combobox.EventsTarget>
								</Pill.Group>
							</PillsInput>
						</Combobox.DropdownTarget>

						<Combobox.Dropdown>
							<Combobox.Options>{options}</Combobox.Options>
							<Combobox.Footer>
								<Text fz="xs" c="dimmed">
									Цены могут меняться в зависимости от сложности работ. Точную стоимость уточняйте у мастера.
								</Text>
							</Combobox.Footer>
						</Combobox.Dropdown>
					</Combobox>
					<Textarea
						label="Описание проблемы"
						description="Расскажите подробно, что необходимо отремонтировать, настроить, осмотреть"
						radius="md"
						value={DETAILS_PREFIX + detailsSuffix}
						onChange={handleDetailsChange}
						required
						autosize
						minRows={3}
					/>

					{error && (
						<Alert
							icon={<IconExclamationCircle size={18} />}
							color="red"
							radius="md"
						>
							{error}
						</Alert>
					)}

					<Button
						onClick={handleSubmit}
						loading={loading}
						fullWidth
						radius="xl"
						disabled={!bicycleName.trim() || !detailsSuffix.trim()}
					>
						Отправить
					</Button>
				</Stack>
			)}
		</Modal>
	);
}
