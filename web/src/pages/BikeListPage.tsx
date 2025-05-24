import { Container, Loader, SimpleGrid, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import BikeCard from "../components/BikeCard";
import { getAllBikes } from "../services/bikeService";
import type { Bike } from "../types/Bike";

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
    <Container>
      <Title order={2} mb="md">Наши электровелосипеды</Title>
      <SimpleGrid cols={3} spacing="lg">
        {bikes.map((bike) => (
          <BikeCard key={bike.id} bike={bike} />
        ))}
      </SimpleGrid>
    </Container>
  );
}
