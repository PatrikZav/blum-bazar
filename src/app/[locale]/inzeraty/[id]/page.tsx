import { Badge, Button, Card, Divider, Group, Image, Stack, Text, Title } from "@mantine/core";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { sendContactEmail } from "@/app/actions/contact";
import { createReview, getSellerReviews, getSellerStats } from "@/app/actions/reviews";
import { ContactModal } from "@/components/listings/ContactModal";
import { EditListingModal } from "@/components/listings/EditListingModal";
import { PaymentModal } from "@/components/listings/PaymentModal";
import { SellerProfile } from "@/components/listings/SellerProfile";
import { db } from "@/db";
import { listing, user } from "@/db/schemas";
import { getSession } from "@/lib/auth";
import { deleteListing, removeListingImage, updateListing } from "./action";

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
  const canContact = !!session && !isOwner;

  let seller = null;
  let sellerStats = { count: 0, avg: 0 };
  let reviews: Awaited<ReturnType<typeof getSellerReviews>> = [];

  if (item.userId) {
    const sellerResult = await db.select().from(user).where(eq(user.id, item.userId));
    seller = sellerResult[0] ?? null;
    sellerStats = await getSellerStats(item.userId);
    reviews = await getSellerReviews(item.userId);
  }

  const canReview = !!session && !isOwner;

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

            <Stack gap="sm">
              <Stack gap={2}>
                <Text size="sm" c="dimmed">
                  {t("page.listings.contact")}
                </Text>
                <Group justify="space-between" align="center">
                  <Text fw={500}>{item.contact}</Text>
                  {canContact && (
                    <ContactModal
                      toEmail={item.contact}
                      listingTitle={item.title}
                      fromName={session ? `${session.firstName} ${session.lastName}` : undefined}
                      fromEmail={session?.email}
                      sendContactEmail={sendContactEmail}
                    />
                  )}
                </Group>
              </Stack>

              <Divider />

              <Group justify="space-between" align="center">
                {!item.isFree && item.accountNumber && (
                  <PaymentModal
                    listing={item}
                    buyerName={session ? `${session.firstName} ${session.lastName}` : undefined}
                  />
                )}
                <Text fw={700} size="xl" c={item.isFree ? "green" : undefined}>
                  {item.isFree ? t("page.listings.free") : `${item.price} Kč`}
                </Text>
              </Group>
            </Stack>

            <Divider />

            {canEdit && (
              <EditListingModal
                listing={item}
                updateListing={updateListing}
                deleteListing={deleteListing}
                removeListingImage={removeListingImage}
              />
            )}
          </Stack>
        </Card>
      </Group>

      {seller && (
        <SellerProfile
          seller={seller}
          listingId={item.id}
          listingTitle={item.title}
          avgRating={sellerStats.avg}
          reviewCount={sellerStats.count}
          canReview={canReview}
          createReview={createReview}
          reviews={reviews}
        />
      )}
    </Stack>
  );
}
