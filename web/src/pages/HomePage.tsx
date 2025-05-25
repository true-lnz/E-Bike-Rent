// src/pages/HomePage.jsx
import { Button, Container, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";

export default function HomePage() {
	return (
		<Container size="lg">
			<Title>Арендуй электровелосипед за минуту</Title>
			<Text size="lg" ta="center" maw={600}>
				Быстро, удобно и экологично. Выбирай, бронируй и катайся по городу уже сегодня!
			</Text>
			<Button component={Link} to="/bikes" size="md">
				Смотреть велосипеды
			</Button>
		</Container>

	);
}
