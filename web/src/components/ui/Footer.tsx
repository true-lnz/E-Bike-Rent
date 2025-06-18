import { Center, Container, Flex, Text } from "@mantine/core";
import { Link } from "react-router-dom";

export default function Footer() {
	return (
		<Container pb="xl" style={{overflow: 'hidden'}}>
			<Center>
				<Flex gap="xl">
					<Text size="sm" color="dimmed">
						&copy; {new Date().getFullYear()} Все права защищены.
					</Text>
					<Text size="sm" color="dimmed" component={Link} to="/policy">
						Политика конфиденциальности
					</Text>
				</Flex>

			</Center>
		</Container>
	);
}
