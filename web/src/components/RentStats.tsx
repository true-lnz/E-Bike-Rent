// src/components/RentStats.jsx

import { Card, Center, Container, Group, Text } from "@mantine/core";

export default function RentStats() {
	return (
		<Container size="lg" my={100}>
			<Card bg="gray.0" radius="xl" p="xl">
				<Group justify="space-around">
					{[
						{ value: 12, label: 'какая-то статистика' },
						{ value: 12, label: 'какая-то статистика' },
						{ value: 3, label: 'какая-то статистика' },
					].map((stat, index) => (
						<Center key={index} style={{ flexDirection: 'column' }}>
							<Text fz={80} fw={700} c="orange">
								{stat.value}
							</Text>
							<Text size="lg">{stat.label}</Text>
						</Center>
					))}
				</Group>
			</Card>
		</Container>
	);
}
