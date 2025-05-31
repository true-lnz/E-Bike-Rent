import { Center, Container, Group, Text } from "@mantine/core";
import { Link } from "react-router-dom";

export default function Footer() {
	return (
		<Container pb="xl" style={{overflow: 'hidden'}}>
			<Center>
				<Group gap="xl">
					<Text size="sm" color="dimmed">
						&copy; {new Date().getFullYear()} «ФулГаз». Все права защищены.
					</Text>
					<Text size="sm" color="dimmed" component={Link} to="/policy">
						Политика конфиденциальности
					</Text>
				</Group>

			</Center>
		</Container>
	);
}
