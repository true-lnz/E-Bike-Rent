import {
	Card,
	Image,
	LoadingOverlay,
	SimpleGrid,
	Stack,
	Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { BASE_IMAGE_URL } from "../../constants.ts";
import { getAllAccessories } from "../../services/accessoryService.ts";
import type { Accessory } from "../../types/accessory.ts";

interface AccessorySelectCardListProps {
  selectedAccessories: number[];
  lockedAccessories?: number[];
  onChangeSelected: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function AccessorySelectCardList({
  selectedAccessories,
  lockedAccessories = [],
  onChangeSelected,
}: AccessorySelectCardListProps) {
  const [accessories_list, setAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllAccessories()
      .then(([fetchedAccessories]) => {
        setAccessories(fetchedAccessories);
      })
      .catch((error) => console.error("Ошибка загрузки:", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingOverlay visible zIndex={101} />;

  function toggleAccessory(id: number) {
    if (lockedAccessories.includes(id)) return;

    if (selectedAccessories.includes(id)) {
      onChangeSelected(selectedAccessories.filter((item) => item !== id));
    } else {
      onChangeSelected([...selectedAccessories, id]);
    }
  }

  return (
    <SimpleGrid
      cols={{ base: 2, sm: 3, md: 4, lg: 5 }}
      spacing="md"
      verticalSpacing="md"
    >
      {accessories_list.map((accessory) => {
        const isSelected = selectedAccessories.includes(accessory.id);
        const isLocked = lockedAccessories.includes(accessory.id);

        return (
          <Stack key={accessory.id} gap={4} style={{ position: "relative" }}>
            <Card
              p="md"
              radius="lg"
              withBorder
              bg="white"
              onClick={() => {
                if (accessory.available_quantity > 0 && !isLocked) {
                  toggleAccessory(accessory.id);
                }
              }}
              style={{
                aspectRatio: "1",
                cursor:
                  accessory.available_quantity > 0 && !isLocked
                    ? "pointer"
                    : "default",
                outline: isSelected
                  ? "2px solid var(--mantine-color-blue-6)"
                  : "1px solid #eee",
                opacity: accessory.available_quantity === 0 ? 0.6 : 1,
                filter:
                  accessory.available_quantity === 0 ? "grayscale(80%)" : "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Stack align="center" gap="xs">
                <Image
                  src={`${BASE_IMAGE_URL}${accessory.image_url}`}
                  alt={accessory.name}
                  height={60}
                  fit="contain"
                />
                <Text
                  fw={600}
                  ta="center"
                  size="sm"
                  lineClamp={2}
                  style={{ wordBreak: "break-word" }}
                >
                  {accessory.name}
                </Text>
              </Stack>
            </Card>

            {isLocked && (
              <Text ta="center" size="xs" c="dimmed">
                Уже добавлен
              </Text>
            )}
          </Stack>
        );
      })}
    </SimpleGrid>
  );
}
