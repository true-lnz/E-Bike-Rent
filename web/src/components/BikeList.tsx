import { Container, Loader, SimpleGrid, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { getAllBikes } from "../services/bikeService";
import type { Bike } from "../types/Bike";
import BikeCard from "./BikeCard";

export default function BikeListPage() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllBikes()
      .then(setBikes)
      .catch((error) => console.error("Ошибка загрузки:", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  
  return (
    <Container id="bikes" size="lg">
      <Title order={1} size={45}>Выбери свою идеальную модель</Title>
      <Title order={1} size={45} mb="xl" c={"orange.5"}>электровелосипеда</Title>
      <SimpleGrid cols={3} spacing="lg">
        {bikes.map((bike) => (
          <BikeCard key={bike.id} bike={bike} />
        ))}
      </SimpleGrid>
    </Container>
  );
}
