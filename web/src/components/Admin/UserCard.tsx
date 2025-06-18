import { Avatar, Box, Button, Divider, Group, HoverCard, Image, Popover, Stack, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconPhoneCall } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { BASE_IMAGE_URL } from '../../constants';
import type { Company } from '../../types/company';
import type { User } from '../../types/user';

interface UserCardProps {
	r: {
		user?: User;
	};
	companiesDict: Record<string, Company>;
}

export const UserCard = ({ r, companiesDict }: UserCardProps) => {
	const isMobile = useMediaQuery('(max-width: 576px)');

	const userCardContent = (
		<Stack gap={4}>
			<Text size="md" fw={500}>{r.user?.last_name} {r.user?.first_name} {r.user?.patronymic}</Text>
			<Text size="md">Город: {r.user?.city}</Text>
			<Divider my="xs" />
			{(r.user?.company_id && companiesDict[r.user.company_id]) ? (
				<>
					<Group gap="sm" align="center">
						<Box>
							<Image
								src={BASE_IMAGE_URL + 'companies/' + companiesDict[r.user.company_id].image_url}
								alt={companiesDict[r.user.company_id].name}
								width={40}
								height={40}
								fit="cover"
							/>
						</Box>
						<Text size="sm" fw={500}>
							{companiesDict[r.user.company_id].name}
						</Text>
					</Group>
					<Divider my="xs" />
				</>
			) : (
				<Text size="sm" fw={500}>
					Нет компании
				</Text>
			)
			}
			<Text size="sm">Почта: {r.user?.email}</Text>
			<Text size="sm">
				Дата рождения: {dayjs(r.user?.birthday).format('DD.MM.YYYY')} (
				Возраст: {dayjs().diff(r.user?.birthday, 'year')})
			</Text>
			<Button
				variant="light"
				color="gray"
				size="xs"
				radius="md"
				fullWidth
				component={Link}
				to={`tel:${r.user?.phone_number}`}
				leftSection={<IconPhoneCall size={14} />}
			>
				Позвонить
			</Button>
		</Stack>
	);

	const triggerElement = (
		<Stack gap="sm" justify="center" align='center' style={{ cursor: 'pointer' }}>
			<Avatar
				size={80}
				name={`${r.user?.first_name} ${r.user?.last_name}`}
				radius={9999}
			/>
			<Text fw={700} fz="xl" flex={1} ta="center" style={{ whiteSpace: 'nowrap' }}>
				{r.user?.last_name} {r.user?.first_name?.[0]}.{r.user?.patronymic?.[0] || ''}.
			</Text>
		</Stack>
	);

	return isMobile ? (
		<Popover width={260} shadow="md" withArrow position="bottom">
			<Popover.Target>{triggerElement}</Popover.Target>
			<Popover.Dropdown>{userCardContent}</Popover.Dropdown>
		</Popover>
	) : (
		<HoverCard width={260} shadow="md" withArrow position="right-start" openDelay={300} closeDelay={300}>
			<HoverCard.Target>{triggerElement}</HoverCard.Target>
			<HoverCard.Dropdown>{userCardContent}</HoverCard.Dropdown>
		</HoverCard>
	);
};