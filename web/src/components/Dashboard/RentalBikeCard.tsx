import {
	Badge,
	Box,
	Button,
	Card,
	Divider,
	Flex,
	Group,
	Image,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import {
	IconAlertCircle,
	IconCheck,
	IconClockHour3,
	IconClockPlus,
	IconHelp,
	IconMail,
	IconPhone,
	IconPlus,
	IconX,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BASE_IMAGE_URL } from "../../constants";
import AccessoryModal from "../Accessory/AccessoryModal";
import ExtendRentalModal from "./ExtendRentalModal";

interface RentalBikeCardProps {
	bikeId: number;
	rentId?: number;
	name: string;
	imageUrl: string;
	rentStart: string;
	rentEnd: string;
	daysLeft?: number;
	hasAccessories: boolean;
	isExpired: boolean;
	isArchived: boolean;
	isActive: boolean;
	isPending?: boolean;
	isDeclined?: boolean;
	status: string;
	accessories: {
		id: number;
		name: string;
		image_url: string;
	}[];
	onExtend?: () => void;
	onContact?: () => void;
	onAddAccessory?: () => void;
}

export function RentalBikeCard({
	bikeId,
	rentId,
	name,
	imageUrl,
	rentStart,
	rentEnd,
	daysLeft,
	hasAccessories,
	isExpired,
	isArchived,
	isActive,
	isPending,
	isDeclined,
	status,
	accessories,
	onExtend,
	onContact,
	onAddAccessory,
}: RentalBikeCardProps) {
	const [accessoryModalOpen, setAccessoryModalOpen] = useState(false);
	const [extendRentalModalOpen, setExtendRentalModalOpen] = useState(false);
	const initialAccessoryIds = useMemo(() => accessories.map(acc => acc.id), [accessories]);


	const renderStatusSection = () => {
		if (isPending) {
			return (
				<Button variant="outline" color="gray" radius="xl">
					<Group gap="xs">
						<IconClockHour3 size="20" />
						Ожидает подтверждения
					</Group>
				</Button>
			);
		}

		if (isDeclined) {
			return (
				<Button variant="outline" color="red" radius="xl">
					<Group gap="xs">
						<IconX size="20" />
						Отказано
					</Group>
				</Button>
			);
		}

		if (isActive) {
			return (
				<Button variant="filled" color="orange" radius="xl"
					onClick={() => {
						setExtendRentalModalOpen(true);
						if (onExtend) onExtend();
					}}
				>
					<Group gap="xs">
						<IconClockPlus size="20" />
						Продлить аренду
					</Group>
				</Button>
			);
		}

		return (
			<Button variant="filled" color="blue" radius="xl">
				<Group gap="xs">
					<IconCheck size={20} />
					Завершен
				</Group>
			</Button>
		);
	};

	return (
		<Box style={{ borderRadius: "xl", overflow: "hidden" }}>
			<Card
				radius='xl'
				p="lg"
				withBorder
				bg="white"
			>
				<Flex align="flex-start" gap="lg">
					<Image
						src={BASE_IMAGE_URL + imageUrl}
						alt={name}
						w={220}
						h={220}
						fit="contain"
						radius="md"
					/>

					<Divider orientation="vertical" />

					<Stack gap="xs" style={{ flex: 1 }}>
						<Group justify="space-between" align="center">
							<Group>
								<Title order={2}>{name}</Title>
								<Link to={`/bikes/${bikeId}`}>
									<Badge
										variant="light"
										color="gray"
										radius="xl"
										size="lg"
										style={{ cursor: "pointer" }}
									>
										О модели
									</Badge>
								</Link>
							</Group>
							{isArchived && (
								<Badge variant="light" color="gray" size="lg" radius="xl">
									Архив
								</Badge>
							)}
						</Group>

						<Text size="md">
							Начало аренды: с {rentStart}
							<br />
							Срок аренды: до {rentEnd}
							{isActive && daysLeft !== undefined && <> (осталось {daysLeft} дн.)</>}
							<br />
							Аксессуары: {hasAccessories ? "есть" : "нет"}
						</Text>
						<Text size="md" fw={500} c={isDeclined ? "red" : "dimmed"}>
							Статус: {status}
						</Text>

						{isActive && isExpired && (
							<Text size="sm" c="orange" fw={500}>
								<IconAlertCircle size={16} style={{ verticalAlign: "middle" }} />{" "}
								Заканчивается срок аренды!
							</Text>
						)}

						<Group mt="sm">
							<Button
								radius="xl"
								bg="gray.2"
								c="black"
								variant="light"
								onClick={() => {
									modals.open({
										title: (
											<Title order={3} ta="center" fw={600}>
												Связаться с «ФулГаз»
											</Title>
										),
										centered: true,
										radius: 'lg',
										withCloseButton: true,
										children: (
											<Stack gap="xs">
												<Group gap="xs">
													<IconMail size={18} />
													<Text size="sm">Почта: <b>fulgaz@gmail.com</b></Text>
												</Group>
												<Group gap="xs">
													<IconHelp size={18} />
													<Text size="sm">Тех. поддержка: <b>help-fulgaz@gmail.com</b></Text>
												</Group>
												<Group gap="xs">
													<IconPhone size={18} />
													<Text size="sm">Телефон: <b>+7 (964) 951-28-10</b></Text>
												</Group>
												<Divider my="xs" />
												<Button fullWidth variant="light" color="blue" component="a" href="tel:+79649512810" onClick={() => modals.closeAll()}>
													Позвонить
												</Button>
											</Stack>
										),
									});
								}}
							>
								Связаться
							</Button>
							{renderStatusSection()}
						</Group>
					</Stack>
				</Flex>
			</Card>

			{/* Блок аксессуаров */}
			{hasAccessories && (
				<Box
					bg="gray.1"
					style={{
						marginTop: '-2rem',
						padding: "3.5rem 1rem 1.5rem 1rem",
						borderBottomLeftRadius: "2rem",
						borderBottomRightRadius: "2rem",
					}}
				>
					<Text ta="center" size="lg" mb="md" fw={500} c="black">
						Аксессуары
					</Text>

					<Group px="xl" gap="xl" wrap="wrap">
						{accessories.map((item) => (
							<Stack
								key={item.id}
								align="center"
								gap={4}
								p="xs"
								style={{
									backgroundColor: "white",
									borderRadius: "16px",
									width: 100,
								}}
							>
								<Image
									src={BASE_IMAGE_URL + item.image_url}
									alt={item.name}
									width={60}
									height={60}
									fit="contain"
								/>
								<Text size="xs" ta="center" color="black">
									{item.name}
								</Text>
							</Stack>
						))}

						{/* Добавить аксессуар */}
						{isActive && (
							<Stack
								justify="center"
								align="center"
								p="xs"
								onClick={() => {
									setAccessoryModalOpen(true);
									if (onAddAccessory) onAddAccessory();
								}}
								style={{
									backgroundColor: "white",
									borderRadius: "16px",
									width: 100,
									height: 100,
									cursor: "pointer",
								}}
							>
								<IconPlus size={24} />
							</Stack>
						)}
					</Group>
				</Box>
			)}

			<AccessoryModal
				opened={accessoryModalOpen}
				onClose={() => setAccessoryModalOpen(false)}
				rentId={rentId}
				initialAccessoryIds={initialAccessoryIds}
			/>
			<ExtendRentalModal
				opened={extendRentalModalOpen}
				onClose={() => setExtendRentalModalOpen(false)}
				rentId={rentId}
			/>
		</Box>
	);
}
