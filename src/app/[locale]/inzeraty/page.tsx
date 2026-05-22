/* Stránka se všemi inzeráty */
/* Stránka se všemi inzeráty */
import { Badge, Button, Card, Group, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { CreateListingModal } from "@/components/listings/CreateListingModal";
import { db } from "@/db";
import { listing, user } from "@/db/schemas";
import { getSession } from "@/lib/auth";
import { createListing } from "./novy/action";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("page.listings.title"),
    description: t("page.listings.description"),
  };
}

const CATEGORIES = ["Nábytek", "Dětské věci", "Oblečení", "Elektronika", "Knihy", "Ostatní"];

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page({ searchParams }: Props) {
  const t = await getTranslations();
  const params = await searchParams;
  const kategorie = typeof params.kategorie === "string" ? params.kategorie : undefined;
  const session = await getSession();

  const listings = kategorie
    ? await db.select().from(listing).where(eq(listing.category, kategorie))
    : await db.select().from(listing);

  const users = await db.select().from(user);
  const userMap = new Map(users.map((u) => [u.id, u]));

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <div>
          <Title>{t("page.listings.title")}</Title>
          <Text c="dimmed">{t("page.listings.description")}</Text>
        </div>
        {session && <CreateListingModal createListing={createListing} userEmail={session.email} />}
      </Group>

      <Group gap="xs">
        <Link href="/cs/inzeraty">
          <Button variant={!kategorie ? "filled" : "light"} size="xs">
            Vše
          </Button>
        </Link>
        {CATEGORIES.map((cat) => (
          <Link key={cat} href={`/cs/inzeraty?kategorie=${encodeURIComponent(cat)}`}>
            <Button variant={kategorie === cat ? "filled" : "light"} size="xs">
              {cat}
            </Button>
          </Link>
        ))}
      </Group>

      {listings.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">
          V této kategorii zatím nejsou žádné inzeráty.
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {listings.map((item) => {
            const owner = item.userId ? userMap.get(item.userId) : null;
            const ownerName = owner ? `${owner.firstName.charAt(0)}. ${owner.lastName}` : item.contact.split("@")[0];

            return (
              <Card key={item.id} shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="sm">
                  <Group justify="space-between" align="center">
                    <Text fw={700} size="sm" c="dimmed">
                      {ownerName}
                    </Text>
                    <Badge
                      color={item.status === "Dostupné" ? "green" : item.status === "Rezervováno" ? "yellow" : "gray"}
                    >
                      {item.status}
                    </Badge>
                  </Group>

                  <Text fw={600} size="lg">
                    {item.title}
                  </Text>

                  <Text c="dimmed" size="sm" lineClamp={2}>
                    {item.description}
                  </Text>

                  <Group gap="xs">
                    <Badge variant="light" color="blue">
                      {item.category}
                    </Badge>
                  </Group>

                  <Group justify="space-between" align="center">
                    <Text fw={700} size="xl" c={item.isFree ? "green" : undefined}>
                      {item.isFree ? t("page.listings.free") : `${item.price} Kč`}
                    </Text>
                    <Link href={`/cs/inzeraty/${item.id}`}>
                      <Button variant="light" size="sm">
                        {t("page.listings.detail")}
                      </Button>
                    </Link>
                  </Group>
                </Stack>
              </Card>
            );
          })}
        </SimpleGrid>
      )}
    </Stack>
  );
}
