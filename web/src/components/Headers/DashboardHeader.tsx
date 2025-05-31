import { Avatar, Box, Button, Container, Divider, Group, HoverCard, Image, rem, Stack, Text, Title } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_IMAGE_URL } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import logo from "./../../assets/images/Logo512x512.png";
import { NavLink } from './NavLink';

export default function DashboardHeader() {
	const { user, } = useAuth();
	const navigate = useNavigate();
	const { setUser } = useAuth();

	const handleLogout = async () => {
		try {
			await authService.logout();
			setUser(null); // очистить auth-контекст
			navigate("/"); // перенаправить на страницу входа
		} catch (error) {
			console.error("Ошибка при выходе:", error);
			alert("Не удалось выйти. Попробуйте позже.");
		}
	};

	const fullName = `${user?.first_name} ${user?.last_name}`;

	return (
		<Container size="lg" component="header" py="xl" style={{ zIndex: 100 }}>
			<Box
				bg="gray.1"
				px="xl"
				py="md"
				style={{
					borderRadius: rem(24),
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				{/* Логотип + навигация */}

				<Group wrap="nowrap" gap="xl" >
					<Link to="/">
						<Image
							src={logo}
							alt="FulGaz"
							w={64}
							h={64}
							radius="sm"
						/>
					</Link>

					<Group gap="xl">
						<NavLink to="bikes">Устройства</NavLink>
						<NavLink to="my-rents">Моя аренда</NavLink>
						<NavLink to="maintenances">Обслуживание</NavLink>
						<NavLink to="contact">Контакты</NavLink>
					</Group>
				</Group>

				{/* Телефон + кнопка */}
				<Group wrap="nowrap" gap="sm">

<HoverCard width={280} shadow="md" radius="lg" withArrow openDelay={100} closeDelay={400}>
      <HoverCard.Target>
        <Avatar size={45} name={fullName} radius="xl" />
      </HoverCard.Target>

      <HoverCard.Dropdown>
        <Stack gap="xs">
          <Title order={4}>{fullName}</Title>
          <Text size="sm" color="dimmed" lineClamp={2}>
            {user?.email}
          </Text>
          <Text size="sm" color="dimmed">
            Телефон: {user?.phone_number}
          </Text>
          <Text size="sm" color="dimmed">
            Дата рождения: {user?.birthday}
          </Text>

          {user?.company && (
            <>
              <Divider my="xs" />
              <Group gap="sm" align="center">
                <Box
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 6,
                    overflow: "hidden",
                    boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src={BASE_IMAGE_URL + user?.company.image_url}
                    alt={user?.company.name}
                    width={40}
                    height={40}
                    fit="cover"
                  />
                </Box>
                <Text size="sm" fw={500}>
                  {user?.company.name}
                </Text>
              </Group>
            </>
          )}

          <Divider my="sm" />
          <Text size="xs" color={user?.is_verified ? "teal" : "red"}>
            {user?.is_verified ? "Потвержденный аккаунт" : "Пользователь не подтверждён"}
          </Text>
          <Text size="xs" color="dimmed">
            Роль: {user?.role === 'user' ? "пользователь" : "администратор"}
          </Text>
        </Stack>
      </HoverCard.Dropdown>
    </HoverCard>

					<Button
						size="md"
						onClick={handleLogout}
						radius="xl"
						color="orange.5"
					>
						Выйти
					</Button>
				</Group>
			</Box>
		</Container >
	);
}
