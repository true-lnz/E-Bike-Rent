import { Center, Container, Text } from "@mantine/core";

export default function Footer() {
  return (
    <Container py="md">
      <Center>
        <Text size="sm" color="dimmed">
          &copy; {new Date().getFullYear()} ЭлектроБайк. Все права защищены.
        </Text>
      </Center>
    </Container>
  );
}
