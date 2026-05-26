"use client";

import {
  Alert,
  Avatar,
  Badge,
  Button,
  Divider,
  Group,
  Modal,
  SegmentedControl,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";

type MyReview = {
  id: number;
  rating: number;
  comment: string | null;
  listingTitle: string | null;
  sellerName: string;
};

type ReceivedReview = {
  id: number;
  rating: number;
  comment: string | null;
  listingTitle: string | null;
  authorName: string;
};

interface Props {
  opened: boolean;
  onClose: () => void;
  getMyReviews: () => Promise<MyReview[]>;
  getReceivedReviews: () => Promise<ReceivedReview[]>;
  updateReview: (
    reviewId: number,
    rating: number,
    comment: string,
    listingTitle: string,
  ) => Promise<{ success?: boolean; error?: string }>;
  deleteReview: (reviewId: number) => Promise<{ success?: boolean; error?: string }>;
}

export function ReviewsModal({ opened, onClose, getMyReviews, getReceivedReviews, updateReview, deleteReview }: Props) {
  const [tab, setTab] = useState("my");
  const [myReviews, setMyReviews] = useState<MyReview[]>([]);
  const [receivedReviews, setReceivedReviews] = useState<ReceivedReview[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editHovered, setEditHovered] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (opened) {
      getMyReviews().then(setMyReviews);
      getReceivedReviews().then(setReceivedReviews);
    }
  }, [opened, getMyReviews, getReceivedReviews]);

  function startEdit(r: MyReview) {
    setEditingId(r.id);
    setEditRating(r.rating);
    setEditComment(r.comment ?? "");
    setEditTitle(r.listingTitle ?? "");
    setError(null);
  }

  async function handleUpdate() {
    if (!editingId) return;
    const result = await updateReview(editingId, editRating, editComment, editTitle);
    if (result.error) {
      setError(result.error);
    } else {
      setEditingId(null);
      const updated = await getMyReviews();
      setMyReviews(updated);
    }
  }

  async function handleDelete(reviewId: number) {
    await deleteReview(reviewId);
    const updated = await getMyReviews();
    setMyReviews(updated);
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Recenze"
      size="md"
      overlayProps={{ backgroundOpacity: 0.35, blur: 8 }}
      styles={{
        content: {
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
        },
        header: { background: "transparent" },
      }}
    >
      <Stack gap="md">
        <SegmentedControl
          value={tab}
          onChange={setTab}
          data={[
            { label: "Moje recenze", value: "my" },
            { label: "Obdržené recenze", value: "received" },
          ]}
          fullWidth
        />

        {tab === "my" && (
          <Stack gap="sm">
            {myReviews.length === 0 ? (
              <Text c="dimmed" ta="center" py="md">
                Zatím jste nezanechali žádnou recenzi.
              </Text>
            ) : (
              myReviews.map((r) => (
                <Stack key={r.id} gap="xs">
                  {editingId === r.id ? (
                    <Stack gap="sm">
                      {error && (
                        <Alert color="red" variant="light">
                          {error}
                        </Alert>
                      )}
                      <Group gap={4}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setEditHovered(star)}
                            onMouseLeave={() => setEditHovered(0)}
                            onClick={() => setEditRating(star)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "1.5rem",
                              color: star <= (editHovered || editRating) ? "#f59e0b" : "#d1d5db",
                              padding: "0 2px",
                            }}
                          >
                            ★
                          </button>
                        ))}
                      </Group>
                      <Textarea
                        label="Komentář"
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        rows={3}
                      />
                      <TextInput
                        label="Název produktu"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                      <Group justify="flex-end">
                        <Button variant="subtle" onClick={() => setEditingId(null)}>
                          Zrušit
                        </Button>
                        <Button onClick={handleUpdate}>Uložit</Button>
                      </Group>
                    </Stack>
                  ) : (
                    <Group justify="space-between" align="flex-start">
                      <Stack gap={4} style={{ flex: 1 }}>
                        <Group gap="xs">
                          <Avatar radius="xl" size="sm" color="orange">
                            {r.sellerName.charAt(0)}
                          </Avatar>
                          <Text size="sm" fw={500}>
                            {r.sellerName}
                          </Text>
                        </Group>
                        <Group gap={2}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              style={{ color: star <= r.rating ? "#f59e0b" : "#d1d5db", fontSize: "0.9rem" }}
                            >
                              ★
                            </span>
                          ))}
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
                      <Group gap="xs">
                        <Button size="xs" variant="light" onClick={() => startEdit(r)}>
                          Upravit
                        </Button>
                        <Button size="xs" color="red" variant="light" onClick={() => handleDelete(r.id)}>
                          Smazat
                        </Button>
                      </Group>
                    </Group>
                  )}
                  <Divider />
                </Stack>
              ))
            )}
          </Stack>
        )}

        {tab === "received" && (
          <Stack gap="sm">
            {receivedReviews.length === 0 ? (
              <Text c="dimmed" ta="center" py="md">
                Zatím jste neobdrželi žádnou recenzi.
              </Text>
            ) : (
              receivedReviews.map((r) => (
                <Stack key={r.id} gap="xs">
                  <Group gap="xs">
                    <Avatar radius="xl" size="sm" color="blue">
                      {r.authorName.charAt(0)}
                    </Avatar>
                    <Text size="sm" fw={500}>
                      {r.authorName}
                    </Text>
                  </Group>
                  <Group gap={2}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} style={{ color: star <= r.rating ? "#f59e0b" : "#d1d5db", fontSize: "0.9rem" }}>
                        ★
                      </span>
                    ))}
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
                  <Divider />
                </Stack>
              ))
            )}
          </Stack>
        )}
      </Stack>
    </Modal>
  );
}
