import {
	ActionIcon,
	Box,
	Button,
	Card,
	Divider,
	Group,
	Image,
	Modal,
	Text,
	rem
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconInfoCircle } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { BASE_IMAGE_URL } from "../../constants.ts";
import type { Bike } from "../../types/bike.ts";
import BikeDetailsModal from "./BikeDetailsModal.tsx";

interface BikeCardProps {
	bike: Bike;
}

export default function BikeCard({ bike }: BikeCardProps) {
	const [opened, { open, close }] = useDisclosure(false);
	const isMobile = useMediaQuery("(max-width: 576px)");
	const [imageOpened, { open: openImage, close: closeImage }] = useDisclosure(false);
	return (
		<>
			<Card
				bg="gray.1"
				p="lg"
				radius="xl"
				style={{
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
				}}
			>
				<Group justify="space-between" mb="xs">
					<Box>
						<Text fw={700} size="xl" lineClamp={1}>
							{bike.name}
						</Text>
						<Text size="sm" c="dimmed">
							{bike.battery} / {bike.power}W
						</Text>
					</Box>
				</Group>

				<Box style={{ flexGrow: 1 }}>
					<Image
						src={`${BASE_IMAGE_URL}${bike.image_url}`}
						alt={bike.name}
						h={220}
						fit="contain"
						mx="auto"
						style={{ objectFit: 'contain', cursor: 'pointer' }}
						onClick={openImage}
					/>
				</Box>

				<Box
					bg="white"
					p="sm"
					mt="md"
					style={{
						borderRadius: rem(24),
						boxShadow: '0 0 12px rgba(0,0,0,0.05)',
					}}
				>
					<Box
						mt="sm"
						mb="md"
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							gap: rem(12),
							flexWrap: 'wrap',
						}}
					>
						<Group justify="space-evenly" gap={isMobile ? "0" : "md"} wrap="nowrap" w="100%">
							<Box>
								<Text size="xs" c="dimmed" className="nobr">
									1 неделя
								</Text>
								<Text fz={{ base: 'xs', xs: '18px', sm: "14px", md: "16px", xxl: '24px' }} fw={600} className="nobr">{(bike.one_week_price / 100).toLocaleString()} ₽</Text>
							</Box>

							<Divider orientation="vertical" />

							<Box>
								<Text size="xs" c="dimmed" className="nobr">
									2 недели
								</Text>
								<Text fz={{ base: 'xs', xs: '18px', sm: "14px", md: "16px", xxl: '24px' }} fw={600} className="nobr">{(bike.two_week_price / 100).toLocaleString()} ₽</Text>
							</Box>

							<Divider orientation="vertical" />

							<Box>
								<Text size="xs" c="dimmed" className="nobr">
									1 месяц
								</Text>
								<Text fw={600} fz={{ base: 'xs', xs: '18px', sm: "14px", md: "16px", xxl: '24px' }} className="nobr">
									{(bike.month_price / 100).toLocaleString()} ₽
								</Text>
							</Box>
						</Group>
					</Box>

					<Group>
						<Button
							radius="xl"
							color="orange.5"
							size="md"
							fz={{ base: "sm", sm: "md" }}
							component={Link}
							to={`/bikes/${bike.id}`}
							style={{ flex: 1, whiteSpace: 'nowrap' }}
						>
							Забронировать
						</Button>

						<ActionIcon
							variant="light"
							color="gray"
							radius="xl"
							size="xl"
							onClick={open}
							aria-label="Подробнее"
						>
							<IconInfoCircle size={24} />
						</ActionIcon>
					</Group>
				</Box>
			</Card>


			<BikeDetailsModal bike={bike} opened={opened} onClose={close} />
			<Modal
				opened={imageOpened}
				onClose={closeImage}
				withCloseButton
				title={`Просмотр: ${bike.name}`}
				centered
				size="xl"
				radius="xl"
				styles={{
					body: {
						backgroundColor: 'white',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					},
				}}
			>
				<Image
					src={`${BASE_IMAGE_URL}${bike.image_url}`}
					alt={bike.name}
					fit="contain"
					style={{ maxHeight: '80vh', maxWidth: '80vw' }}
				/>
			</Modal>

		</>
	);
}