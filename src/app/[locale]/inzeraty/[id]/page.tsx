/* Stránka detailu jednoho inzerátu */
import { Badge, Button, Card, Divider, Group, Stack, Text, Title } from "@mantine/core";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { listing } from "@/db/schemas";
import { updateListing } from "./action";
import { EditListingModal } from "@/components/listings/EditListingModal";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const result = await db.select().from(listing).where(eq(listing.id, Number(id)));
  const item = result[0];
  if (!item) return { title: "Inzerát nenalezen" };
  return { title: item.title };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const t = await getTranslations();

  const result = await db.select().from(listing).where(eq(listing.id, Number(id)));
  const item = result[0];

  if (!item) notFound();

  return (
    <Stack gap="lg" maw={800} mx="auto">
      <Link href="/cs/inzeraty">
        <Button variant="subtle" size="sm">
          ← Zpět na přehled
        </Button>
      </Link>

      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Stack gap="md">
          <Group justify="space-between" align="flex-start">
            <Title order={2}>{item.title}</Title>
            <Badge
              size="lg"
              color={
                item.status === "Dostupné"
                  ? "green"
                  : item.status === "Rezervováno"
                    ? "yellow"
                    : "gray"
              }
            >
              {item.status}
            </Badge>
          </Group>

          <Group gap="xs">
            <Badge variant="light" color="blue">
              {item.category}
            </Badge>
          </Group>

          <Divider />

          <Text size="md">{item.description}</Text>

          <Divider />

          <Group justify="space-between" align="center">
            <Stack gap={2}>
              <Text size="sm" c="dimmed">
                {t("page.listings.contact")}
              </Text>
              <Text fw={500}>{item.contact}</Text>
            </Stack>

            <Text fw={700} size="xl" c={item.isFree ? "green" : undefined}>
              {item.isFree ? t("page.listings.free") : `${item.price} Kč`}
            </Text>
          </Group>

          <Divider />

          <EditListingModal listing={item} updateListing={updateListing} />
        </Stack>
      </Card>
    </Stack>
  );
}
