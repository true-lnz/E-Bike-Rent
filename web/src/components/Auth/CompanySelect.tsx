import {
	Button,
	Grid,
	Loader,
	ScrollArea,
	Stack,
	TextInput,
	Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import type { Company } from "../../types/Company";
import CompanyCard from "../CompanyCard";

export default function CompanySelect() {
	const [companies, setCompanies] = useState<Company[]>([]);
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch("/api/companies")
			.then((res) => res.json())
			.then(setCompanies)
			.finally(() => setLoading(false));
	}, []);

	const filtered = companies.filter((c) =>
		c.name.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<Stack p="lg" align="stretch" gap="lg">
			<Title order={3}>Выбери компанию</Title>

			<TextInput
				placeholder="Поиск..."
				value={search}
				onChange={(e) => setSearch(e.currentTarget.value)}
			/>

			{loading ? (
				<Loader />
			) : (
				<ScrollArea h={500}>
					<Grid gutter="md">
						{filtered.map((company) => (
							<Grid.Col span={{ base: 6, sm: 4, md: 3 }} key={company.id}>
								<CompanyCard
									company={company}
									selected={selectedId === company.id}
									onSelect={setSelectedId}
								/>
							</Grid.Col>
						))}
					</Grid>
				</ScrollArea>
			)}

			<Button disabled={!selectedId} radius="xl" fullWidth>
				Зарегистрироваться
			</Button>
		</Stack>
	);
}