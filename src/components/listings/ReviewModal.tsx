"use client";

import { Alert, Button, Group, Modal, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

interface Props {
  sellerId: number;
  listingId: number;
  listingTitle: string;
  createReview: (formData: FormData) => Promise<{ error?: string } | void>;
}

export function ReviewModal({ sellerId, listingId, listingTitle, createReview }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    if (rating === 0) {
      setError("Vyberte hodnocení.");
      return;
    }
    formData.set("rating", String(rating));
    const result = await createReview(formData);
    if (result && "error" in result && result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => {
        close();
        setSuccess(false);
        setRating(0);
      }, 1500);
    }
  }

  return (
    <>
      <Button variant="light" size="sm" onClick={open}>
        Zanechat recenzi
      </Button>

      <Modal
        opened={opened}
        onClose={close}
        title="Zanechat recenzi"
        size="sm"
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
        <form action={handleSubmit}>
          <input type="hidden" name="sellerId" value={sellerId} />
          <input type="hidden" name="listingId" value={listingId} />

          <Stack gap="md">
            {error && (
              <Alert color="red" variant="light">
                {error}
              </Alert>
            )}
            {success && (
              <Alert color="green" variant="light">
                Recenze byla přidána!
              </Alert>
            )}

            <Stack gap={4}>
              <Text size="sm" fw={500}>
                Hodnocení
              </Text>
              <Group gap={4}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setRating(star)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "2rem",
                      color: star <= (hovered || rating) ? "#f59e0b" : "#d1d5db",
                      padding: "0 2px",
                    }}
                  >
                    ★
                  </button>
                ))}
              </Group>
            </Stack>

            <Textarea name="comment" label="Popis (volitelné)" placeholder="Jak proběhl nákup?" rows={3} />

            <TextInput name="listingTitle" label="Název produktu (volitelné)" defaultValue={listingTitle} />

            <Group justify="flex-end">
              <Button variant="subtle" onClick={close}>
                Zrušit
              </Button>
              <Button type="submit">Odeslat recenzi</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
