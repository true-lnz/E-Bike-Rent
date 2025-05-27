import {
	Button,
	Grid,
	Loader,
	ScrollArea,
	Stack,
	TextInput,
	Title
} from "@mantine/core";
import { useEffect, useState } from "react";
import { companyService } from "../../services/companyService";
import type { Company } from "../../types/company";
import CompanyCard from "../CompanyCard";

type Props = {
	selectedId: number | null;
	onSelect: (id: number | null) => void;
};

export default function CompanySelect({ selectedId, onSelect }: Props) {
	const [companies, setCompanies] = useState<Company[]>([]);
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		companyService
			.getAll()
			.then(setCompanies)
			.finally(() => setLoading(false));
	}, []);

	const filtered = companies.filter((c) =>
		c.name.toLowerCase().includes(search.toLowerCase())
	);

	const handleCardClick = (id: number) => {
		onSelect(selectedId === id ? null : id); // повторая карточка снимает выбор
	};

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
				<>
					<ScrollArea h={500}>
						<Grid gutter="md">
							{filtered.map((company) => (
								<Grid.Col span={{ base: 6, sm: 4, md: 3 }} key={company.id}>
									<CompanyCard
										company={company}
										selected={selectedId === company.id}
										onSelect={() => handleCardClick(company.id)}
									/>
								</Grid.Col>
							))}
						</Grid>
					</ScrollArea>

					<Button
						variant={selectedId === null ? "filled" : "outline"}
						onClick={() => onSelect(null)}
						color="gray"
						radius="xl"
						fullWidth
					>
						Без компании
					</Button>
				</>
			)}
		</Stack>
	);
}
