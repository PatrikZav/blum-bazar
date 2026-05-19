/* Domovská stránka */
import { Button, Card, Group, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("page.home.title"),
    description: t("page.home.description"),
  };
}

const CATEGORIES = [
  { label: "Nábytek", emoji: "🛋️" },
  { label: "Dětské věci", emoji: "🧸" },
  { label: "Oblečení", emoji: "👕" },
  { label: "Elektronika", emoji: "💻" },
  { label: "Knihy", emoji: "📚" },
  { label: "Ostatní", emoji: "📦" },
];

export default async function Page() {
  const t = await getTranslations();

  return (
    <Stack gap="xl">
      <Stack gap="md" align="center" py="xl">
        <Title ta="center" size="h1">
          {t("page.home.title")}
        </Title>
        <Text c="dimmed" ta="center" size="lg" maw={500}>
          {t("page.home.description")}
        </Text>
        <Group>
          <Link href="/cs/inzeraty">
            <Button size="md">{t("page.home.browse")}</Button>
          </Link>
          <Link href="/cs/inzeraty/novy">
            <Button size="md" variant="light">
              {t("page.home.addListing")}
            </Button>
          </Link>
        </Group>
      </Stack>

      <Stack gap="md">
        <Title order={2}>{t("page.home.categoriesTitle")}</Title>
        <SimpleGrid cols={{ base: 2, sm: 3, lg: 6 }} spacing="md">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={`/cs/inzeraty?kategorie=${encodeURIComponent(cat.label)}`}
              style={{ textDecoration: "none" }}
            >
              <Card shadow="sm" padding="lg" radius="md" withBorder style={{ cursor: "pointer" }}>
                <Stack align="center" gap="xs">
                  <Text size="xl">{cat.emoji}</Text>
                  <Text fw={500} ta="center" size="sm">
                    {cat.label}
                  </Text>
                </Stack>
              </Card>
            </Link>
          ))}
        </SimpleGrid>
      </Stack>
    </Stack>
  );
}
