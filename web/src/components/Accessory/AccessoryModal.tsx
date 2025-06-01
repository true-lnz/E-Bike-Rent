import {
	Button,
	Group,
	Modal,
	Stack,
	Text,
} from "@mantine/core";

import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { sendFeedback } from "../../services/feedbackService";
import AccessorySelectCardList from "./AccessorySelectCardList";

interface Props {
  opened: boolean;
  onClose: () => void;
  rentId?: number;
}

export default function AccessoryModal({ opened, onClose, rentId }: Props) {
  const { user } = useAuth();
  const [selected, setSelected] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Ошибка или информационное сообщение
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusColor, setStatusColor] = useState<"red" | "green" | "gray">("gray");

  // Управление модальным окном успешной отправки
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  useEffect(() => {
    if (!opened) {
      setSelected([]);
      setStatusMessage(null);
      setStatusColor("gray");
      setSuccessModalOpen(false);
    }
  }, [opened]);

  const handleSubmit = async () => {
    if (!user) {
      setStatusMessage("Пользователь не авторизован");
      setStatusColor("red");
      return;
    }

    setSubmitting(true);
    setStatusMessage(null);

    const fullName = `${user.last_name} ${user.first_name} ${user.patronymic}`;
    const text = `
Пользователь запросил добавление аксессуаров к аренде №${rentId}

👤 ФИО: ${fullName}
📧 Email: ${user.email}
📞 Телефон: ${user.phone_number}
🛠 Выбранные аксессуары (ID): ${selected.join(", ") || "—"}
`.trim();

    try {
      const response = await sendFeedback({
        phoneNumber: user.phone_number,
        text,
      });

      if (!response.error) {
        // Показываем модалку успеха
        setSuccessModalOpen(true);
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      setStatusMessage("Не удалось отправить запрос. Попробуйте позже.");
      setStatusColor("red");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Modal opened={opened} onClose={onClose} title="Добавить аксессуары" size="lg" radius="lg"  centered>
        <Stack gap="md">
          <AccessorySelectCardList
            selectedAccessories={selected}
            onChangeSelected={setSelected}
          />

          {/* Сообщение об ошибке */}
          {statusMessage && statusColor === "red" && (
            <Text color={statusColor} size="sm" mt="sm" ta="center">
              {statusMessage}
            </Text>
          )}

          <Group mt="sm" align="end" gap="xs" justify="flex-end">
            <Button variant="default" onClick={onClose} radius="md" disabled={submitting}>
              Отмена
            </Button>
            <Button
              onClick={handleSubmit}
              loading={submitting}
							radius="md"
              disabled={selected.length === 0 || submitting}
            >
              Выбрать
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Модальное окно успеха */}
      <Modal
        opened={successModalOpen}
        onClose={() => {
          setSuccessModalOpen(false);
          onClose();
        }}
        title="Запрос отправлен"
        centered
        size="sm"
				radius="lg"
        withCloseButton={false}
      >
        <Text>Отлично! Скоро с вами свяжется оператор для уточнения информации.</Text>
        <Button fullWidth mt="md" radius="md" onClick={() => {
          setSuccessModalOpen(false);
          onClose();
        }}>
          Закрыть
        </Button>
      </Modal>
    </>
  );
}
