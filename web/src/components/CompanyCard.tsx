import { Card, Image, Stack, Text } from "@mantine/core";
import type { Company } from "../types/company";

interface CompanyCardProps {
  company: Company;
  selected: boolean;
  onSelect: (id: number) => void;
}

export default function CompanyCard({ company, selected, onSelect }: CompanyCardProps) {
  return (
    <Card
      withBorder
      shadow={selected ? "md" : "xs"}
      radius="lg"
      padding="md"
      onClick={() => onSelect(company.id)}
      style={{
        cursor: "pointer",
        borderColor: selected ? "#1c7ed6" : undefined,
        transition: "0.2s ease",
      }}
    >
      <Stack align="center" gap="xs">
        <Image
          src={company.image_url}
          alt={company.name}
          width={56}
          height={56}
          fit="contain"
        />
        <Text ta="center" size="sm" fw={500}>
          {company.name}
        </Text>
      </Stack>
    </Card>
  );
}