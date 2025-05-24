import { Anchor, Container, Group, Text } from "@mantine/core";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <Container py="md">
      <Group justify="apart">
        <Text size="xl" fw={700}>ЭлектроБайк</Text>
        <Group gap="md">
          <Anchor component={Link} to="/">Главная</Anchor>
          <Anchor component={Link} to="/bikes">Велосипеды</Anchor>
        </Group>
      </Group>
    </Container>
  );
}
