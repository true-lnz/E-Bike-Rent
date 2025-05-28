import {
	ActionIcon,
	Badge,
	Box,
	Button,
	Card,
	Divider,
	Group,
	Image,
	Text,
	rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconInfoCircle } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { BASE_IMAGE_URL } from "../constants.ts";
import type { Bike } from "../types/bike.ts";
import BikeDetailsModal from "./BikeDetailsModal.tsx";

interface BikeCardProps {
  bike: Bike;
}

export default function BikeCard({ bike }: BikeCardProps) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Card
        bg="gray.0"
        p="lg"
        radius="lg"
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Group justify="space-between" mb="xs">
          <Box>
            <Text fw={700} size="lg">
              {bike.name}
            </Text>
            <Text size="sm" c="dimmed">
              {bike.battery} / {bike.power}W
            </Text>
          </Box>
          <Badge
            color={bike.quantity > 0 ? "lime" : "gray"}
            variant="filled"
            radius="xl"
          >
            {bike.quantity > 0 ? "В наличии" : "Нет в наличии"}
          </Badge>
        </Group>

        <Image
          src={`${BASE_IMAGE_URL}${bike.image_url}`}
          alt={bike.name}
          h={280}
          fit="contain"
          mx="auto"
        />

        <Box
          bg="white"
          p="sm"
          mt="md"
          style={{
            borderRadius: rem(24),
            boxShadow: "0 0 12px rgba(0,0,0,0.05)",
          }}
        >
          <Box
            mt="sm"
            mb="md"
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: rem(12),
            }}
          >
            <Group justify="space-between" gap="md" wrap="nowrap">
              <Box>
                <Text size="xs" c="dimmed">
                  1 неделя
                </Text>
                <Text fw={600}>{(bike.day_price * 7).toLocaleString()} ₽</Text>
              </Box>

              <Divider orientation="vertical" />

              <Box>
                <Text size="xs" c="dimmed">
                  2 недели
                </Text>
                <Text fw={600}>{(bike.day_price * 14).toLocaleString()} ₽</Text>
              </Box>

              <Divider orientation="vertical" />

              <Box>
                <Text size="xs" c="dimmed">
                  1 месяц
                </Text>
                <Text fw={600}>
                  {(bike.day_price * 30).toLocaleString()} ₽/мес.
                </Text>
              </Box>
            </Group>
          </Box>

          <Group>
            <Button
              radius="xl"
              color="orange.5"
              size="md"
              component={Link}
              to={`/bikes/${bike.id}`}
              style={{ flex: 1 }}
            >
              Забронировать
            </Button>

            <ActionIcon
              variant="light"
              color="gray"
              radius="xl"
              size="xl"
              onClick={open}
              aria-label="Подробнее"
            >
              <IconInfoCircle size={24} />
            </ActionIcon>
          </Group>
        </Box>
      </Card>

      <BikeDetailsModal bike={bike} opened={opened} onClose={close} />
    </>
  );
}