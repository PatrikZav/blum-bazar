"use client";

import { Button, Divider, Image, Modal, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { Listing } from "@/db/schemas";

interface Props {
  listing: Listing;
}

export function PaymentModal({ listing }: Props) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button color="green" onClick={open}>
        💳 Zaplatit
      </Button>

      <Modal
        opened={opened}
        onClose={close}
        title="Platební údaje"
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
        <Stack gap="md" align="center">
          <Title order={3}>{listing.title}</Title>
          <Text fw={700} size="xl" c="orange">
            {listing.price} Kč
          </Text>

          {listing.qrCode && <Image src={listing.qrCode} alt="QR kód platby" w={440} h={440} fit="contain" />}

          {listing.accountNumber && (
            <>
              <Divider w="100%" />
              <Stack gap={4} align="center">
                <Text size="sm" c="dimmed">
                  Číslo účtu
                </Text>
                <Text fw={600}>{listing.accountNumber}</Text>
              </Stack>
            </>
          )}

          <Divider w="100%" />

          <Text size="sm" c="dimmed" ta="center">
            ⚠️ Při platbě nezapomeňte uvést své jméno jako poznámku.
          </Text>
        </Stack>
      </Modal>
    </>
  );
}
