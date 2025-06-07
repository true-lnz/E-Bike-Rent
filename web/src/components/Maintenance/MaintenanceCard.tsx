import { Box, Button, Card, Image, rem, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import type { ReactNode } from "react";

export function MaintenanceCard({
  title,
  description,
  onApplyClick,
  icon = "",
  background = "#fff",
  textColor = "black",
  btnVariant = "light",
}: {
  title: string;
  description: string;
  onApplyClick: () => void;
  icon?: string | ReactNode;
  background?: string;
  textColor?: string;
  btnVariant?: string;
}) {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isTablet = useMediaQuery("(max-width: 900px)");

  const iconWidth = isMobile ? 70 : isTablet ? 100 : 150;
  const iconBoxWidth = isMobile ? 80 : isTablet ? 110 : 170;
  const iconBoxRight = isMobile ? rem(5) : isTablet ? rem(10) : rem(30);
  const iconBoxBottom = isMobile ? rem(10) : rem(20);

  const titleFontSize = isMobile ? rem(20) : isTablet ? rem(26) : rem(32);

  const renderIcon = () => {
    if (!icon) return null;

    if (typeof icon === "string") {
      return (
        <Image
          src={icon}
          alt={title}
          style={{ width: iconWidth, height: "auto", display: "block" }}
        />
      );
    }

    return icon;
  };

  return (
    <Card
      shadow="sm"
      p="xl"
      radius="xl"
      bg={background}
      pos="relative"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        pos="absolute"
        right={iconBoxRight}
        bottom={iconBoxBottom}
        style={{ width: iconBoxWidth, zIndex: 1 }}
      >
        {renderIcon()}
      </Box>

      <Text fz={titleFontSize} fw={700} c={textColor} mb="md" lh={1.2} style={{ maxWidth: "90%" }}>
        {title}
      </Text>

      <Box
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          width: isMobile ? "100%" : "66%",
          zIndex: 2,
          position: "relative",
        }}
      >
        <Text c={textColor} size="md" mb="auto">
          {description}
        </Text>

        <Button
          onClick={onApplyClick}
          variant={btnVariant}
          color="dark"
          radius="xl"
          size="md"
          leftSection={<IconPlus size={18} />}
          w="fit-content"
          mt="lg"
          style={{ alignSelf: "flex-start" }}
        >
          Оставить заявку
        </Button>
      </Box>
    </Card>
  );
}
