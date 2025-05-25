import {
	Button,
	Card,
	Center,
	PinInput,
	rem,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { useEffect, useState } from "react";

export default function PinCodeForm() {
  const [timer, setTimer] = useState(60);

  // Обратный отсчет
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) clearInterval(interval);
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Center h="72vh">
      <Card withBorder shadow="sm" padding={rem(45)} radius="lg" w={420}>
        <Stack gap="md">
          {/* Заголовок и подзаголовок */}
          <Stack gap={rem(4)}>
            <Title order={1} ta="center">
              Код подтверждения отправлен на почту
            </Title>

            <Text size="xs" c="dimmed" ta="center">
              Введи его ниже, чтобы продолжить. Если письмо не пришло, проверь папку "Спам" или запроси новый код.
            </Text>
          </Stack>

          {/* Pin-код */}
          <Center>
            <PinInput length={6} size="lg" oneTimeCode />
          </Center>

          {/* Таймер */}
          <Text size="xs" c="dimmed" ta="center">
            Получить новый код можно через <strong>{timer} сек.</strong>
          </Text>

          {/* Кнопка отправки (опционально) */}
          <Button
            c="dark.9"
            color="gray.3"
            fw={700}
            radius="xl"
            size="md"
            fullWidth
            disabled={timer > 0}
            onClick={() => setTimer(60)} // для примера: сброс таймера
          >
            Отправить код повторно
          </Button>
        </Stack>
      </Card>
    </Center>
  );
}
