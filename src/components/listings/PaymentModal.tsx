"use client";

import { Button, Divider, Modal, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import type { Listing } from "@/db/schemas";

interface Props {
  listing: Listing;
  buyerName?: string;
  reserveListing: (formData: FormData) => Promise<void>;
}

function accountToIban(accountNumber: string): string | null {
  const parts = accountNumber.split("/");
  if (parts.length !== 2) return null;

  const [account, bankCode] = parts;
  const paddedAccount = account.replace("-", "").padStart(16, "0");
  const bban = `${bankCode}${paddedAccount}`;
  const numericIban = `${bban}123500`;
  const mod = BigInt(numericIban) % 97n;
  const checkDigits = String(98n - mod).padStart(2, "0");
  return `CZ${checkDigits}${bban}`;
}

export function PaymentModal({ listing, buyerName, reserveListing }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [reserved, setReserved] = useState(false);

  useEffect(() => {
    if (!opened || !listing.accountNumber) return;

    const iban = accountToIban(listing.accountNumber);
    if (!iban) return;

    const message = buyerName ? `${buyerName} - ${listing.title}` : listing.title;

    const spdString = [
      "SPD*1.0",
      `ACC:${iban}`,
      listing.price ? `AM:${listing.price}.00` : null,
      `MSG:${message.substring(0, 60)}`,
    ]
      .filter(Boolean)
      .join("*");

    QRCode.toDataURL(spdString, { width: 300, margin: 2 }).then(setQrDataUrl).catch(console.error);
  }, [opened, listing, buyerName]);

  async function handleReserve() {
    const formData = new FormData();
    formData.append("id", String(listing.id));
    formData.append("status", "Rezervováno");
    await reserveListing(formData);
    setReserved(true);
    close();
  }

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

          {qrDataUrl ? (
            <img src={qrDataUrl} alt="QR kód platby" width={300} height={300} />
          ) : (
            <Text c="dimmed" size="sm">
              Generuji QR kód...
            </Text>
          )}

          <Divider w="100%" />

          <Stack gap={4} align="center">
            <Text size="sm" c="dimmed">
              Číslo účtu
            </Text>
            <Text fw={600}>{listing.accountNumber}</Text>
          </Stack>

          <Divider w="100%" />

          <Text size="sm" c="dimmed" ta="center">
            ⚠️ Zpráva pro příjemce: {buyerName ? `${buyerName} - ` : ""}
            {listing.title}
          </Text>

          <Divider w="100%" />

          <Button variant="light" color="yellow" fullWidth onClick={handleReserve} disabled={reserved}>
            {reserved ? "Rezervováno" : "Rezervovat inzerát"}
          </Button>
        </Stack>
      </Modal>
    </>
  );
}
