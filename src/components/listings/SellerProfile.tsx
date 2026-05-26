import { Avatar, Badge, Card, Divider, Group, Stack, Text } from "@mantine/core";
import type { createReview, getSellerReviews } from "@/app/actions/reviews";
import { ReviewModal } from "@/components/listings/ReviewModal";

interface Props {
  seller: {
    id: number;
    firstName: string;
    lastName: string;
  };
  listingId: number;
  listingTitle: string;
  avgRating: number;
  reviewCount: number;
  canReview: boolean;
  createReview: typeof createReview;
  reviews: Awaited<ReturnType<typeof getSellerReviews>>;
}

export function SellerProfile({
  seller,
  listingId,
  listingTitle,
  avgRating,
  reviewCount,
  canReview,
  createReview,
  reviews,
}: Props) {
  const initials = `${seller.firstName.charAt(0)}${seller.lastName.charAt(0)}`;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Group gap="md">
            <Avatar radius="xl" size="md" color="orange">
              {initials}
            </Avatar>
            <Stack gap={2}>
              <Text fw={600}>
                {seller.firstName} {seller.lastName}
              </Text>
              <Group gap="xs" align="center">
                <Group gap={2}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      style={{
                        color: star <= Math.round(avgRating) ? "#f59e0b" : "#d1d5db",
                        fontSize: "1rem",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </Group>
                <Text size="sm" c="dimmed">
                  {avgRating > 0 ? avgRating.toFixed(1) : "Bez hodnocení"} · {reviewCount}{" "}
                  {reviewCount === 1 ? "recenze" : reviewCount < 5 ? "recenze" : "recenzí"}
                </Text>
              </Group>
            </Stack>
          </Group>

          {canReview && (
            <ReviewModal
              sellerId={seller.id}
              listingId={listingId}
              listingTitle={listingTitle}
              createReview={createReview}
            />
          )}
        </Group>

        {reviews.length > 0 && (
          <>
            <Divider />
            <Stack gap="sm">
              {reviews.map((r) => (
                <Card key={r.id} padding="sm" radius="md" withBorder bg="gray.0">
                  <Stack gap={4}>
                    <Group justify="space-between" align="center">
                      <Group gap="xs">
                        <Avatar radius="xl" size="sm" color="blue">
                          {r.authorName.charAt(0)}
                        </Avatar>
                        <Text fw={500} size="sm">
                          {r.authorName}
                        </Text>
                      </Group>
                      <Group gap={4}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            style={{
                              color: star <= r.rating ? "#f59e0b" : "#d1d5db",
                              fontSize: "0.9rem",
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </Group>
                    </Group>

                    {r.listingTitle && (
                      <Badge variant="light" color="blue" size="sm">
                        {r.listingTitle}
                      </Badge>
                    )}

                    {r.comment && (
                      <Text size="sm" c="dimmed">
                        {r.comment}
                      </Text>
                    )}
                  </Stack>
                </Card>
              ))}
            </Stack>
          </>
        )}
      </Stack>
    </Card>
  );
}
