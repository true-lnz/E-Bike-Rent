// src/components/RentStats.jsx

import { Card, Center, Container, Group, Text } from "@mantine/core";

export default function RentStats() {
	return (
		<Container size="lg" mt={100}>
			<Card bg="gray.1" radius="xl" p="xl">
				<Group justify="space-around" align="flex-start">
					{[
						{ value: "300+", label: 'пользователей уже арендовали наши велосипеды' },
						{ value: "1.5ч", label: 'среднее время ремонта вашего велосипеда' },
						{ value: "25%", label: 'скидка при долгосрочной аренде от 3 месяцев' },
					].map((stat, index) => (
						<Center key={index} style={{ flexDirection: 'column' }}>
							<Text
								fz={80}
								fw={700}
								c="orange.5"
							>
								{stat.value}
							</Text>
							<Text size="lg" ta="center" w={300}>{stat.label}</Text>
						</Center>
					))}
				</Group>
			</Card>
		</Container>
	);
}
