import { Button, Card, Stack, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import type { Bike } from "../types/Bike";

interface BikeCardProps {
  bike: Bike;
}

export default function BikeCard({ bike }: BikeCardProps) {
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Stack gap="xs">
        <Text fw={700}>{bike.name}</Text>
        <Text size="sm">Макс. скорость: {bike.max_speed_kmh} км/ч</Text>
        <Text size="sm">Запас хода: {bike.max_range_km} км</Text>
        <Text size="sm">Цена в день: {bike.day_price}₽</Text>
        <Button component={Link} to={`/bikes/${bike.id}`} variant="light" fullWidth>
          Подробнее
        </Button>
      </Stack>
    </Card>
  );
}
