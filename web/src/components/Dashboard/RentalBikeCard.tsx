import {
	Badge,
	Button,
	Card,
	Divider,
	Flex,
	Group,
	Image,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { IconAlertCircle, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BASE_IMAGE_URL } from "../../constants";
import AccessoryModal from "../Accessory/AccessoryModal";

interface RentalBikeCardProps {
  bikeId: number;
  rentId?: number;
  name: string;
  imageUrl: string;
  rentStart: string;
  rentEnd: string;
  daysLeft?: number;
  hasAccessories: boolean;
  isExpired: boolean;
  isArchived: boolean;
  isActive: boolean;
  isPending?: boolean;
  isDeclined?: boolean;
  status: string;
  accessories: {
    id: number;
    name: string;
    image_url: string;
  }[];
  onExtend?: () => void;
  onContact?: () => void;
	onAddAccessory?: () => void;
}

export function RentalBikeCard({
  bikeId,
  rentId,
  name,
  imageUrl,
  rentStart,
  rentEnd,
  daysLeft,
  hasAccessories,
  isExpired,
  isArchived,
  isActive,
  isPending,
  isDeclined,
  status,
  accessories,
  onExtend,
  onContact,
	onAddAccessory,
}: RentalBikeCardProps) {
  const [accessoryModalOpen, setAccessoryModalOpen] = useState(false);

	const renderStatusSection = () => {
    if (isPending) {
      return (
        <Button variant="outline" color="gray" radius="xl" disabled>
          Ожидает подтверждения
        </Button>
      );
    }

    if (isDeclined) {
      return (
        <Button variant="outline" color="red" radius="xl" disabled>
          Отказано
        </Button>
      );
    }

    if (isActive) {
      return (
        <>
          <Button variant="default" radius="xl" onClick={onContact}>
            Связаться
          </Button>
          <Button variant="filled" color="orange" radius="xl" onClick={onExtend}>
            Продлить аренду
          </Button>
        </>
      );
    }

    return (
      <Button variant="filled" color="blue" radius="xl">
        ✓ Завершен
      </Button>
    );
  };

  return (
    <Card shadow="md" radius="xl" p="lg" withBorder bg="white">
      <Flex align="flex-start" gap="lg">
        <Image
          src={BASE_IMAGE_URL + imageUrl}
          alt={name}
          w={220}
          h={220}
          fit="contain"
          radius="md"
        />

        <Divider orientation="vertical" />

        <Stack gap="xs" style={{ flex: 1 }}>
          <Group justify="space-between" align="center">
            <Group>
              <Title order={2}>{name}</Title>
              <Link to={`/bikes/${bikeId}`}>
                <Badge
                  variant="light"
                  color="gray"
                  radius="xl"
                  size="lg"
                  style={{ cursor: "pointer" }}
                >
                  О модели
                </Badge>
              </Link>
            </Group>
            {isArchived && (
              <Badge variant="light" color="gray" size="lg" radius="xl">
                Архив
              </Badge>
            )}
          </Group>

          <Text size="md">
            Начало аренды: с {rentStart}
            <br />
            Срок аренды: до {rentEnd}
            {isActive && daysLeft !== undefined && <> (осталось {daysLeft} дн.)</>}
            <br />
            Аксессуары: {hasAccessories ? "есть" : "нет"}
          </Text>
          <Text size="md" fw={500} c={isDeclined ? "red" : "dimmed"}>
            Статус: {status}
          </Text>

          {isActive && isExpired && (
            <Text size="sm" c="orange" fw={500}>
              <IconAlertCircle size={16} style={{ verticalAlign: "middle" }} />{" "}
              Заканчивается срок аренды!
            </Text>
          )}

          <Group mt="sm">{renderStatusSection()}</Group>
        </Stack>
      </Flex>

      {/* Блок аксессуаров */}
      {hasAccessories && (
        <>
          <Divider my="md" />
          <Text ta="center" size="lg" mb="xs" ml="sm">
            Аксессуары
          </Text>

          <Group gap="lg" wrap="wrap" px="sm">
            {accessories.map((item) => (
              <Stack
                key={item.id}
                align="center"
                gap={4}
                p="xs"
                style={{
                  backgroundColor: "#f8f8f8",
                  borderRadius: "16px",
                  width: 120,
                }}
              >
                <Image
                  src={BASE_IMAGE_URL + item.image_url}
                  alt={item.name}
                  width={80}
                  height={80}
                  fit="contain"
                />
                <Text size="xs" ta="center">
                  {item.name}
                </Text>
              </Stack>
            ))}

            {/* Добавить аксессуар */}
{isActive && (
  <Stack
    justify="center"
    align="center"
    p="xs"
    onClick={() => {
      setAccessoryModalOpen(true);
      if (onAddAccessory) onAddAccessory();
    }}
    style={{
      backgroundColor: "#f8f8f8",
      borderRadius: "16px",
      width: 80,
      height: 80,
      cursor: "pointer",
    }}
  >
    <IconPlus size={24} />
  </Stack>
)}

          </Group>
        </>
      )}

      <AccessoryModal
        opened={accessoryModalOpen}
        onClose={() => setAccessoryModalOpen(false)}
        rentId={rentId}
      />
    </Card>
  );
}
