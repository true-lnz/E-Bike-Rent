import {
	Alert,
	Button,
	Center,
	Modal,
	Stack,
	Text,
	Textarea,
	TextInput,
} from "@mantine/core";
import { IconExclamationCircle, IconSquareCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";

type Props = {
  opened: boolean;
  onClose: () => void;
  onCreate: (form: { bicycle_name: string; details: string }) => Promise<void>;
  defaultTitle?: string;
};

export function MaintenanceModal({
  opened,
  onClose,
  onCreate,
  defaultTitle = "",
}: Props) {
  const DETAILS_PREFIX = `${defaultTitle}: `;

  const [bicycleName, setBicycleName] = useState("");
  const [detailsSuffix, setDetailsSuffix] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // При открытии модалки — сбрасываем состояние
  useEffect(() => {
    if (opened) {
      setSuccess(false);
      setError("");
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
            <IconSquareCheck size={80}  color="green" />
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
            onChange={(e) => setBicycleName(e.currentTarget.value)}
            required
          />
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
