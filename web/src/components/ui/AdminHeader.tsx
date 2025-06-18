import {
	Badge,
	Box,
	Burger,
	Button,
	Container,
	Drawer,
	Flex,
	Group,
	Image,
	Stack,
	em,
	rem
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { IconLogout } from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { logout } from '../../services/authService';
import logo from './../../assets/images/Logo512x512.png';
import { NavLink } from './NavLink';

type NavItem = {
  path: string;
  label: string;
};

export default function AdminHeader() {
  const location = useLocation();
  const [opened, { toggle, close }] = useDisclosure(false);
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  const { setEmail, setUser, setIsVerified } = useAuth();

  const navItems: NavItem[] = [
    { path: 'rent-requests', label: 'Заявки на аренду' },
    { path: 'maintenance-requests', label: 'Заявки на обслуживание' },
    { path: 'all-bikes', label: 'Все велосипеды' },
    { path: 'all-accessories', label: 'Все аксессуары' },
  ];

  const getActiveNav = () => {
    const currentPath = location.pathname.split('/').pop() || '';
    return navItems.find(item => item.path === currentPath)?.path || '';
  };

  const handleLogout = () => {
    document.cookie = 'token=; Max-Age=0; path=/';
    setUser(null);
    setEmail('');
    setIsVerified(false);
    logout();
    window.location.reload();
  };

  return (
    <Container size="lg" component="header" py="xl" px="14" style={{ zIndex: 100 }}>
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
        {/* Левая часть: логотип */}
        <Group wrap="nowrap" gap="xl">
          <Link to="/">
            <Image src={logo} alt="FulGaz" w={64} h={64} radius="sm" />
          </Link>
        </Group>

        {/* Центр: навигация */}
        {!isMobile && (
          <Flex gap="sm" rowGap="2" wrap="wrap" mr="auto" ml="xl">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                active={getActiveNav() === item.path}
              >
                {item.label}
              </NavLink>
            ))}
          </Flex>
        )}

        {/* Правая часть: бургер или действия */}
        <Group gap="sm" wrap='nowrap'>
          {!isMobile ? (
            <>
              <Badge visibleFrom='md' variant="outline">Админ-панель</Badge>
              <Button
                size="md"
                onClick={handleLogout}
                radius="xl"
                color="orange.5"
                style={{ whiteSpace: 'nowrap' }}
                leftSection={<IconLogout size={16} />}
              >
                Выйти
              </Button>
            </>
          ) : (
            <Burger opened={opened} onClick={toggle} aria-label="Открыть меню" />
          )}
        </Group>
      </Box>

      {/* Drawer справа */}
      <Drawer
        opened={opened}
        onClose={close}
        title="Админ-панель"
        padding="md"
        size="250px"
        position="right"
        overlayProps={{ opacity: 0.5, blur: 4 }}
      >
        <Stack gap="xs">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              active={getActiveNav() === item.path}
              onClick={close}
            >
              {item.label}
            </NavLink>
          ))}

          <Button
            fullWidth
            variant="light"
            color="orange.5"
						radius="xl"
						mt="xl"
            onClick={() => {
              handleLogout();
              close();
            }}
            style={{ whiteSpace: 'nowrap' }}
          >
            Выйти
          </Button>
        </Stack>
      </Drawer>
    </Container>
  );
}
