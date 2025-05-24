import { Button, Container, Loader, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllBikes } from "../services/bikeService"; // Пока мок
import type { Bike } from "../types/Bike";

export default function BikeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [bike, setBike] = useState<Bike | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllBikes().then((bikes) => {
      const found = bikes.find((b) => b.id === Number(id));
      setBike(found || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <Loader />;
  if (!bike) return <Text>Велосипед не найден</Text>;

  return (
    <Container>
      <Title order={2}>{bike.name}</Title>
      <Text>Макс. скорость: {bike.max_speed_kmh} км/ч</Text>
      <Text>Запас хода: {bike.max_range_km} км</Text>
      <Text>Вес: {bike.weight_kg} кг</Text>
      <Text>Мощность: {bike.power_w} Вт</Text>
      <Text>Цена в день: {bike.day_price}₽</Text>
      <Button mt="md">Арендовать</Button>
    </Container>
  );
}
