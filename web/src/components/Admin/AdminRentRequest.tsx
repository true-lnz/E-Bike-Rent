import {
	Button,
	Group,
	Modal,
	Select,
	Stack,
	Table,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { getAllRents, updateRent } from "../../services/rentService";
import type { Rent } from "../../types/rent";
import AccessorySelectCardList from "../Accessory/AccessorySelectCardList";

export default function AdminRentRequests() {
  const [rents, setRents] = useState<Rent[]>([]);
  const [selectedRent, setSelectedRent] = useState<Rent | null>(null);
  const [accessories, setAccessories] = useState<number[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    getAllRents().then(setRents);
  }, []);

  const handleOpenModal = (rent: Rent) => {
    setSelectedRent(rent);
    setAccessories(rent.accessories.map((a) => a.id));
    setStartDate(rent.start_date || "");
    setStatus(rent.status);
    open();
  };

  const handleSubmit = async () => {
    if (!selectedRent?.id) return;
    await updateRent(selectedRent.id, {
      startDate,
      status,
      accessories,
    });
    const updated = await getAllRents();
    setRents(updated);
    close();
  };

  return (
    <>
      <Title order={2} mb="md">Запросы на аренду</Title>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Пользователь</Table.Th>
            <Table.Th>Велосипед</Table.Th>
            <Table.Th>Срок</Table.Th>
            <Table.Th>Статус</Table.Th>
            <Table.Th>Цена</Table.Th>
            <Table.Th>Аксессуары</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rents.map((rent) => (
            <Table.Tr key={rent.id}>
              <Table.Td>{rent.id}</Table.Td>
              <Table.Td>{rent.user?.email}</Table.Td>
              <Table.Td>{rent.bicycle.name}</Table.Td>
              <Table.Td>
                {dayjs(rent.start_date).format("DD.MM.YYYY")} - {dayjs(rent.expire_date).format("DD.MM.YYYY")}
              </Table.Td>
              <Table.Td>{rent.status}</Table.Td>
              <Table.Td>{rent.rent_price + rent.accessory_price}₽</Table.Td>
              <Table.Td>{rent.accessories.map((a) => a.name).join(", ")}</Table.Td>
              <Table.Td>
                <Button size="xs" onClick={() => handleOpenModal(rent)}>
                  Изменить
                </Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal opened={opened} onClose={close} title="Редактировать аренду" size="xl">
        <Stack>
          <TextInput
            label="Дата начала (ISO формат)"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <Select
            label="Статус"
            data={["ожидает подтверждения", "арендован", "завершена", "аренда продлена"]}
            value={status}
            onChange={(val) => setStatus(val || "")}
          />

          <Text fw={600}>Выберите аксессуары</Text>
          <AccessorySelectCardList
            selectedAccessories={accessories}
            onChangeSelected={setAccessories}
          />

          <Group justify="end">
            <Button variant="default" onClick={close}>
              Отмена
            </Button>
            <Button onClick={handleSubmit}>Сохранить</Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
