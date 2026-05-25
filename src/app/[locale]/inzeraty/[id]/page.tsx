import { Badge, Button, Card, Divider, Group, Image, Stack, Text, Title } from "@mantine/core";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { EditListingModal } from "@/components/listings/EditListingModal";
import { PaymentModal } from "@/components/listings/PaymentModal";
import { db } from "@/db";
import { listing } from "@/db/schemas";
import { getSession } from "@/lib/auth";
import { deleteListing, removeListingImage, removeListingQr, updateListing } from "./action";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const result = await db
    .select()
    .from(listing)
    .where(eq(listing.id, Number(id)));
  const item = result[0];
  if (!item) return { title: "Inzerát nenalezen" };
  return { title: item.title };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const t = await getTranslations();
  const session = await getSession();

  const result = await db
    .select()
    .from(listing)
    .where(eq(listing.id, Number(id)));
  const item = result[0];

  if (!item) notFound();

  const isOwner = session?.id === item.userId;
  const isAdmin = session?.role === "admin";
  const canEdit = isOwner || isAdmin;

  return (
    <Stack gap="lg" maw={900} mx="auto">
      <Link href="/cs/inzeraty">
        <Button variant="subtle" size="sm">
          ← Zpět na přehled
        </Button>
      </Link>

      <Group align="stretch" gap="md" wrap="nowrap">
        {item.image && (
          <Card shadow="sm" padding={0} radius="md" withBorder style={{ width: "350px", flexShrink: 0 }}>
            <Image src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </Card>
        )}

        <Card shadow="sm" padding="xl" radius="md" withBorder style={{ flex: 1 }}>
          <Stack gap="md">
            <Group justify="space-between" align="flex-start">
              <Title order={2}>{item.title}</Title>
              <Badge
                size="lg"
                color={item.status === "Dostupné" ? "green" : item.status === "Rezervováno" ? "yellow" : "gray"}
              >
                {item.status}
              </Badge>
            </Group>

            <Group gap="xs">
              <Badge variant="light" color="blue">
                {item.category}
              </Badge>
              {isAdmin && (
                <Badge variant="light" color="orange">
                  Admin
                </Badge>
              )}
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

            <Group>
              {canEdit && (
                <EditListingModal
                  listing={item}
                  updateListing={updateListing}
                  deleteListing={deleteListing}
                  removeListingImage={removeListingImage}
                  removeListingQr={removeListingQr}
                />
              )}
              {!item.isFree && (item.qrCode || item.accountNumber) && <PaymentModal listing={item} />}
            </Group>
          </Stack>
        </Card>
      </Group>
    </Stack>
  );
}
