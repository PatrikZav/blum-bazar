/* Stránka se všemi inzeráty */
import { Badge, Button, Card, Group, SimpleGrid, Stack, Text, TextInput, Title } from "@mantine/core";
import { and, eq, inArray, like, or } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { toggleFavorite } from "@/app/actions/favorites";
import { CreateListingModal } from "@/components/listings/CreateListingModal";
import { FavoriteButton } from "@/components/listings/FavoriteButton";
import { db } from "@/db";
import { favorite, listing, user } from "@/db/schemas";
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
  const query = typeof params.q === "string" ? params.q : undefined;
  const userId = typeof params.userId === "string" ? params.userId : undefined;
  const oblibene = params.oblibene === "1";
  const session = await getSession();

  let listings = kategorie
    ? await db.select().from(listing).where(eq(listing.category, kategorie))
    : await db.select().from(listing);

  if (query) {
    const q = `%${query}%`;
    listings = await db
      .select()
      .from(listing)
      .where(or(like(listing.title, q), like(listing.description, q)));
  }

  if (userId) {
    listings = await db
      .select()
      .from(listing)
      .where(eq(listing.userId, Number(userId)));
  }

  if (oblibene && session) {
    const favorites = await db.select().from(favorite).where(eq(favorite.userId, session.id));
    const ids = favorites.map((f) => f.listingId);
    listings = ids.length > 0 ? await db.select().from(listing).where(inArray(listing.id, ids)) : [];
  }

  const users = await db.select().from(user);
  const userMap = new Map(users.map((u) => [u.id, u]));

  const userFavorites = session ? await db.select().from(favorite).where(eq(favorite.userId, session.id)) : [];
  const favoriteIds = new Set(userFavorites.map((f) => f.listingId));

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <div>
          <Title>{t("page.listings.title")}</Title>
          <Text c="dimmed">{t("page.listings.description")}</Text>
        </div>
        <Group>
          <form method="GET" action="/cs/inzeraty">
            <TextInput
              name="q"
              placeholder="Hledat inzeráty..."
              defaultValue={query ?? ""}
              style={{ width: "250px" }}
            />
          </form>
          {session && <CreateListingModal createListing={createListing} userEmail={session.email} />}
        </Group>
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

      {query && (
        <Text c="dimmed" size="sm">
          Výsledky hledání pro: <strong>{query}</strong>
        </Text>
      )}

      {userId && (
        <Text c="dimmed" size="sm">
          Zobrazuji: <strong>Moje inzeráty</strong>
        </Text>
      )}

      {oblibene && (
        <Text c="dimmed" size="sm">
          Zobrazuji: <strong>Oblíbené inzeráty</strong>
        </Text>
      )}

      {listings.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">
          {query
            ? "Žádné inzeráty neodpovídají vašemu hledání."
            : oblibene
              ? "Zatím nemáte žádné oblíbené inzeráty."
              : "V této kategorii zatím nejsou žádné inzeráty."}
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {listings.map((item) => {
            const owner = item.userId ? userMap.get(item.userId) : null;
            const ownerName = owner ? `${owner.firstName.charAt(0)}. ${owner.lastName}` : item.contact.split("@")[0];
            const isFavorited = favoriteIds.has(item.id);

            return (
              <Card key={item.id} shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="sm">
                  <Group justify="space-between" align="center">
                    <Text fw={700} size="sm" c="dimmed">
                      {ownerName}
                    </Text>
                    <Group gap="xs">
                      <Badge
                        color={item.status === "Dostupné" ? "green" : item.status === "Rezervováno" ? "yellow" : "gray"}
                      >
                        {item.status}
                      </Badge>
                      {session && (
                        <FavoriteButton listingId={item.id} isFavorited={isFavorited} toggleFavorite={toggleFavorite} />
                      )}
                    </Group>
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
