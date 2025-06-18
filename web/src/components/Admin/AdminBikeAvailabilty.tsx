import { Flex, Progress, Text, Tooltip } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

interface AdminBikeAvailabilityProps {
  rented: number;
  available: number;
  total: number;
}

export const AdminBikeAvailability = ({
  rented,
  available,
  total,
}: AdminBikeAvailabilityProps) => {
	const isMobile = useMediaQuery("(max-width: 576px)");
	
  const MIN_PERCENT = isMobile ? 40 : 15;
  const FIXED_TOTAL_PERCENT = isMobile ? 20 : 15;

  const rentedPercent = (rented / total) * 100;
  const availablePercent = (available / total) * 100;

  // Для rented и available: если 0 — не отображаем
  let rp = rented === 0 ? 0 : Math.max(rentedPercent, MIN_PERCENT);
  let ap = available === 0 ? 0 : Math.max(availablePercent, MIN_PERCENT);

  // total — всегда фиксировано
  const op = FIXED_TOTAL_PERCENT;

  // Пересчёт процентов для rented и available, чтобы сумма с total была 100%
  const sum = rp + ap;

  // Если сумма 0, чтобы не делить на 0, просто используем 0 для rp и ap
  if (sum === 0) {
    rp = 0;
    ap = 0;
  } else {
    const scale = (100 - FIXED_TOTAL_PERCENT) / sum;
    rp = rp * scale;
    ap = ap * scale;
  }

  return (
    <Flex align="center" gap="sm" style={{ width: "100%" }}>
      <Progress.Root size={20} style={{ flex: 1, borderRadius: 999, overflow: "hidden" }}>
        {rp > 0 && (
          <Progress.Section
            value={rp}
            color="orange.5"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 8px" }}
          >
            <Tooltip label={`В аренде: ${rented}`} withArrow position="top">
              <Text
                size="xs"
                fw={500}
                c="white"
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                  textAlign: "center",
                  cursor: "default",
                }}
              >
                В аренде: {rented}
              </Text>
            </Tooltip>
          </Progress.Section>
        )}

        {ap > 0 && (
          <Progress.Section
            value={ap}
            color="gray.3"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 8px" }}
          >
            <Tooltip label={`Свободны: ${available}`} withArrow position="top">
              <Text
                size="xs"
                fw={500}
                c="black"
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                  textAlign: "center",
                  cursor: "default",
                }}
              >
                Свободны: {available}
              </Text>
            </Tooltip>
          </Progress.Section>
        )}

        <Progress.Section
          value={op}
          color="gray.5"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 8px" }}
        >
          <Tooltip label={`Всего: ${total}`} withArrow position="top">
            <Text
              size="xs"
              fw={500}
              c="black"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "100%",
                textAlign: "center",
                cursor: "default",
              }}
            >
              Всего: {total}
            </Text>
          </Tooltip>
        </Progress.Section>
      </Progress.Root>
    </Flex>
  );
};
