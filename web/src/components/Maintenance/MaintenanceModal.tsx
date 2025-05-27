import { Button, Modal, Stack, Textarea, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";

type Props = {
  opened: boolean;
  onClose: () => void;
  onCreate: (form: { bicycle_name: string; details: string }) => void;
  defaultTitle?: string;
};

export function MaintenanceModal({ opened, onClose, onCreate, defaultTitle = "" }: Props) {
  const DETAILS_PREFIX = `${defaultTitle}: `;

  const [bicycleName, setBicycleName] = useState("");
  const [detailsSuffix, setDetailsSuffix] = useState("");
  const [loading, setLoading] = useState(false);

  // При смене defaultTitle обновляем префикс и очищаем suffix
  useEffect(() => {
    setDetailsSuffix("dfgh");
  }, [defaultTitle]);

  const handleDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.currentTarget.value;

    // Если префикс нарушен — возвращаем его
    if (!value.startsWith(DETAILS_PREFIX)) {
      setDetailsSuffix(value.slice(DETAILS_PREFIX.length));
    } else {
      setDetailsSuffix(value.slice(DETAILS_PREFIX.length));
    }
  };

	const handleSubmit = async () => {
		if (!bicycleName.trim() || !detailsSuffix.trim()) {
			return; // Не отправляем, если поля пустые
		}

		setLoading(true);
		await onCreate({
			bicycle_name: bicycleName.trim(),
			details: DETAILS_PREFIX + detailsSuffix.trim(),
		});
		setLoading(false);
		setBicycleName("");
		setDetailsSuffix("");
		onClose();
	};

  return (
    <Modal size="lg" opened={opened} onClose={onClose} radius="lg" title="Новая заявка" centered>
      <Stack>
        <TextInput
          label="Название велосипеда"
					radius="md"
          value={bicycleName}
          onChange={(e) => setBicycleName(e.currentTarget.value)}
          required
        />
        <Textarea
          label="Описание"
					radius="md"
          value={DETAILS_PREFIX + detailsSuffix}
          onChange={handleDetailsChange}
          required
          autosize
          minRows={3}
        />
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
    </Modal>
  );
}
