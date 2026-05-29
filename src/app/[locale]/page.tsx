// Hlavní domovská stránka, kde uživatel vidí uvítání a výběr kategorií.
import { Button, Group, Stack, Text, Title } from "@mantine/core";
import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { CategoryCard } from "@/components/listings/CategoryCard";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("page.home.title"),
    description: t("page.home.description"),
  };
}

const CATEGORIES = [
  { label: "Nábytek", emoji: "🛋️", image: "/categories/nabytek.jpg", color: "#e8d5b7" },
  { label: "Dětské věci", emoji: "🧸", image: "/categories/detske-veci.jpg", color: "#ffd6e0" },
  { label: "Oblečení", emoji: "👕", image: "/categories/obleceni.jpg", color: "#c8e6c9" },
  { label: "Elektronika", emoji: "💻", image: "/categories/elektronika.jpg", color: "#bbdefb" },
  { label: "Knihy", emoji: "📚", image: "/categories/knihy.jpg", color: "#e1bee7" },
  { label: "Ostatní", emoji: "📦", image: "/categories/ostatni.jpg", color: "#ffe0b2" },
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
          <Link href="/cs/inzeraty?novy=1">
            <Button size="md" variant="light">
              {t("page.home.addListing")}
            </Button>
          </Link>
        </Group>
      </Stack>

      <Stack gap="md">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.5rem",
            maxWidth: "100%",
            margin: "0 auto",
          }}
        >
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.label} label={cat.label} emoji={cat.emoji} image={cat.image} color={cat.color} />
          ))}
        </div>
      </Stack>
    </Stack>
  );
}
