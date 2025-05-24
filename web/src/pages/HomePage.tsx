// src/pages/HomePage.jsx
import { Button, Stack, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <Stack gap="xl" align="center" mt="xl">
      <Title>Арендуй электровелосипед за минуту</Title>
      <Text size="lg" ta="center" maw={600}>
        Быстро, удобно и экологично. Выбирай, бронируй и катайся по городу уже сегодня!
      </Text>
      <Button component={Link} to="/bikes" size="md">
        Смотреть велосипеды
      </Button>
    </Stack>
  );
}
