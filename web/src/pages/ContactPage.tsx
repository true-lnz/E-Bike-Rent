import {
	Box, Button, Card, Container, Grid, Group, Image, Input, Stack,
	Text,
	Textarea, Title, rem
} from '@mantine/core';
import {
	IconBolt,
	IconDeviceDesktopCog,
	IconMail,
	IconMapPin,
	IconPhone,
	IconSettings,
	IconTool,
} from '@tabler/icons-react';
import { IMaskInput } from 'react-imask';
import logo from "../assets/images/Logo512x512.png";

export default function ContactPage() {
  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="lg">Контактная информация</Title>
      <Grid gutter="xl">
        {/* Левая колонка */}
        <Grid.Col span={{ base: 12, md: 5 }}>
          {/* Информация о компании */}
          <Card shadow="sm" radius="xl" p="xl" mb="md" withBorder bg="orange.5" c="white">
            <Stack gap="sm">
              <Group align="center">
                <Box
                  style={{
                    backgroundColor: 'white',
                    padding: '13px',
                    borderRadius: '9999px',
                    display: 'inline-block',
                  }}
                >
                  <Image src={logo} alt="FulGaz logo" w={60} h={60} />
                </Box>
                <Text fw={700} fz={40}>«ФулГаз»</Text>
              </Group>

              <Stack gap={4} mt="xs">
                <Group gap="xs">
                  <IconMail size={18} />
                  <Text size="md"><b>Почта:</b> fulgaz@gmail.com</Text>
                </Group>
                <Group gap="xs">
                  <IconMail size={18} />
                  <Text size="md"><b>Тех. поддержка:</b> help-fulgaz@gmail.com</Text>
                </Group>
                <Group gap="xs">
                  <IconPhone size={18} />
                  <Text size="md"><b>Телефон:</b> +7 (964) 951-28-10</Text>
                </Group>
              </Stack>
            </Stack>
          </Card>

          {/* Адрес */}
          <Card shadow="sm" radius="xl" p="xl" mb="md" withBorder>
            <Group gap="xs" mb="xs">
              <IconMapPin size={20} />
              <Text fw={600} fz="lg">Адрес</Text>
            </Group>
            <Text size="sm">Республика Башкортостан, г. Уфа</Text>
            <Text size="sm" c="dimmed">Еще более точный адрес</Text>
          </Card>

          {/* Услуги */}
          <Card shadow="sm" radius="xl" p="xl" withBorder>
            <Text fw={600} fz="lg" mb="sm">Услуги</Text>
            <Stack gap="xs">
              <Group gap="xs">
                <IconBolt size={18} />
                <Text size="sm">Сдача в аренду электровелосипедов</Text>
              </Group>
              <Group gap="xs">
                <IconTool size={18} />
                <Text size="sm">Ремонт и обслуживание велосипедов</Text>
              </Group>
              <Group gap="xs">
                <IconDeviceDesktopCog size={18} />
                <Text size="sm">Прошивка ПО электровелосипедов</Text>
              </Group>
              <Group gap="xs">
                <IconSettings size={18} />
                <Text size="sm">Диагностика электросистем велосипедов</Text>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>

        {/* Правая колонка */}
        <Grid.Col span={{ base: 12, md: 7 }}>
          {/* Карта */}
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

          {/* Обратная связь */}
          <Card shadow="sm" radius="xl" p="xl" withBorder>
            <Text fw={600} fz="lg" mb="sm">Форма обратной связи</Text>
            <form onSubmit={(e) => {
              e.preventDefault();
              // todo логика отправки
            }}>
              <Textarea
                autosize
                minRows={6}
                maxRows={6}
                radius="md"
                placeholder="Какой у вас вопрос?"
                required
              />
              <Group mt="sm">
								<Input radius="md" component={IMaskInput} mask="+7 (000) 000-00-00" placeholder="Ваш телефон" />
                <Button radius="md" type="submit" color="blue.7">Отправить</Button>
              </Group>
            </form>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
