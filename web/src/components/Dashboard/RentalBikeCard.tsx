import {
	ActionIcon,
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
	rem
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
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
	IconX
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
	accessories,
	onExtend,
	onContact,
	onAddAccessory,
}: RentalBikeCardProps) {
	const [accessoryModalOpen, setAccessoryModalOpen] = useState(false);
	const [extendRentalModalOpen, setExtendRentalModalOpen] = useState(false);
	const initialAccessoryIds = useMemo(() => accessories.map((acc) => acc.id), [accessories]);
	const isMobile = useMediaQuery("(max-width: 576px)");

	const renderStatusSection = () => {
		if (isPending) {
			return (
				<Button variant="outline" color="gray" radius="xl" fullWidth={isMobile}>
					<Group gap="xs" wrap="nowrap">
						<IconClockHour3 size={20} />
						Ожидает подтверждения
					</Group>
				</Button>
			);
		}
		if (isDeclined) {
			return (
				<Button variant="outline" color="red" radius="xl" fullWidth={isMobile}>
					<Group gap="xs" wrap="nowrap">
						<IconX size={20} />
						Отказано
					</Group>
				</Button>
			);
		}
		if (isActive) {
			return (
				<Button
					variant="filled"
					color="orange"
					radius="xl"
					fullWidth={isMobile}
					onClick={() => {
						setExtendRentalModalOpen(true);
						onExtend?.();
					}}
				>
					<Group gap="xs" wrap="nowrap">
						<IconClockPlus size={20} />
						Продлить аренду
					</Group>
				</Button>
			);
		}
		return (
			<Button variant="filled" color="blue" radius="xl" fullWidth={isMobile}>
				<Group gap="xs" wrap="nowrap">
					<IconCheck size={20} />
					Завершен
				</Group>
			</Button>
		);
	};

	return (
		<Box style={{ borderRadius: rem(20), overflow: "hidden" }}>
			<Card radius="xl" p="lg" withBorder bg="white" h={{ base: "100%", sm: 260 }}>
				{isArchived && (
					<Badge variant="light" color="gray" size="lg" radius="xl" hiddenFrom="sm" pos="absolute" style={{ right: 20 }}>
						Архив
					</Badge>
				)}
				<Flex
					direction={{ base: "column", sm: "row" }}
					align={{ base: "center", xs: "flex-start" }}
					gap="lg"
				>
					<Image
						src={BASE_IMAGE_URL + imageUrl}
						alt={name}
						w={{ base: "100%", sm: 220 }}
						h={220}
						fit="contain"
						radius="md"
					/>

					<Divider orientation="vertical" visibleFrom="sm" />

					<Stack gap="xs" h="100%" w="100%">
						<Group justify="space-between" align="flex-end" wrap="wrap">
							<Flex gap="md" rowGap="2" align="flex-end" wrap="wrap">
								<Title order={2} style={{ wordBreak: "break-word" }}>
									{name}
								</Title>
								<Link to={`/bikes/${bikeId}`}>
									<Badge variant="outline" color="gray" radius="xl" size="lg">
										О модели
									</Badge>
								</Link>
							</Flex>
							{isArchived && (
								<Badge variant="light" color="gray" size="lg" radius="xl" visibleFrom="sm">
									Архив
								</Badge>
							)}
						</Group>

						<Text size="md" style={{ wordBreak: "break-word" }}>
							Начало аренды: с {rentStart}
							<br />
							Срок аренды: до {rentEnd}
							{isActive && daysLeft !== undefined && <> (осталось {daysLeft} дн.)</>}
							<br />
							Аксессуары:{" "}
							{hasAccessories ? (
								"есть"
							) : (
								<>
									нет{" "}
									<Text
										component="a"
										href="#"
										variant="link"
										c="blue.7"
										onClick={(e) => {
											e.preventDefault();
											setAccessoryModalOpen(true);
											onAddAccessory?.();
										}}
										style={{
											cursor: "pointer",
											display: "inline",
											fontWeight: 500,
										}}
									>
										(добавить)
									</Text>
								</>
							)}
						</Text>

						{isActive && isExpired && (
							<Text size="sm" c="orange" fw={500} style={{ marginTop: "auto" }}>
								<IconAlertCircle
									size={16}
									style={{ verticalAlign: "middle", marginRight: 4 }}
								/>
								Заканчивается срок аренды!
							</Text>
						)}

						<Group mt="auto" gap="xs" w="100%" wrap="nowrap">
							<Button
								radius="xl"
								bg="gray.2"
								c="black"
								variant="light"
								visibleFrom="sm"
								onClick={() => {
									onContact?.();
									modals.open({
										title: (
											<Title order={3} ta="center" fw={600}>
												Связаться с «ФулГаз»
											</Title>
										),
										centered: true,
										radius: "lg",
										withCloseButton: true,
										children: (
											<Stack gap="xs">
												<Group gap="xs">
													<IconMail size={18} />
													<Text size="sm" component="a" href="mailto:thebearonegey@gmail.com">Почта: <b>thebearonegey@gmail.com</b></Text>
												</Group>
												<Group gap="xs">
													<IconPhone size={18} />
													<Text size="sm" component="a" href="tel:+79047382666">Тел.: <b>+7 (904) 738-26-66</b></Text>
												</Group>
												<Group gap="xs">
													<IconHelp size={18} />
													<Text size="sm" component="a" href="https://t.me/FulGaz_Ufa">Менеджер: <b>@FulGaz_ufa</b></Text>
												</Group>
												<Divider my="xs" />
												<Button fullWidth variant="light" color="blue" component="a" href="tel:+79047382666" onClick={() => modals.closeAll()}>
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
							<ActionIcon size="40" radius="xl" variant="light" color="gray" hiddenFrom="sm"
								onClick={() => {
									onContact?.();
									modals.open({
										title: (
											<Title order={3} ta="center" fw={600}>
												Связаться с «ФулГаз»
											</Title>
										),
										centered: true,
										radius: "lg",
										withCloseButton: true,
										children: (
											<Stack gap="xs">
												<Group gap="xs">
													<IconMail size={18} />
													<Text size="sm" component="a" href="mailto:thebearonegey@gmail.com">Почта: <b>thebearonegey@gmail.com</b></Text>
												</Group>
												<Group gap="xs">
													<IconPhone size={18} />
													<Text size="sm" component="a" href="tel:+79047382666">Тел.: <b>+7 (904) 738-26-66</b></Text>
												</Group>
												<Group gap="xs">
													<IconHelp size={18} />
													<Text size="sm" component="a" href="https://t.me/FulGaz_Ufa">Менеджер: <b>@FulGaz_ufa</b></Text>
												</Group>
												<Divider my="xs" />
												<Button fullWidth variant="light" color="blue" component="a" href="tel:+79047382666" onClick={() => modals.closeAll()}>
													Позвонить
												</Button>
											</Stack>
										),
									});
								}}
							>
								<IconPhone size="18" />
							</ActionIcon>
						</Group>
					</Stack>
				</Flex>
			</Card>

			{hasAccessories && (
				<Box
					bg="gray.1"
					mt={{ base: "-45px", sm: "-32px" }}
					style={{
						padding: "3.5rem 1rem 1.35rem 1rem",
						borderBottomLeftRadius: rem(32),
						borderBottomRightRadius: rem(32),
					}}
				>
					<Text ta="center" size="lg" mb="md" fw={500}>
						Аксессуары
					</Text>

					<Group px={{ base: "6", sm: "xl" }} gap={isMobile ? "sm" : "xl"} wrap="wrap">
						{accessories.map((item) => (
							<Stack
								key={item.id}
								align="center"
								gap={4}
								p="xs"
								style={{
									backgroundColor: "white",
									borderRadius: rem(16),
									width: 100,
									wordBreak: "break-word",
								}}
							>
								<Image
									src={BASE_IMAGE_URL + item.image_url}
									alt={item.name}
									width={60}
									height={60}
									fit="contain"
								/>
								<Text size="xs" ta="center">
									{item.name}
								</Text>
							</Stack>
						))}
						{1 && (
							<Stack
								justify="center"
								align="center"
								p="xs"
								onClick={() => {
									setAccessoryModalOpen(true);
									onAddAccessory?.();
								}}
								style={{
									backgroundColor: "white",
									borderRadius: rem(16),
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
