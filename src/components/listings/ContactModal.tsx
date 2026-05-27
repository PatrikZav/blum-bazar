"use client";

import { Alert, Button, Group, Modal, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

interface Props {
  toEmail: string;
  listingTitle: string;
  fromName?: string;
  fromEmail?: string;
  sendContactEmail: (formData: FormData) => Promise<{ success?: boolean; error?: string }>;
}

export function ContactModal({ toEmail, listingTitle, fromName, fromEmail, sendContactEmail }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await sendContactEmail(formData);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => {
        close();
        setSuccess(false);
      }, 2000);
    }
  }

  return (
    <>
      <Button variant="light" size="sm" onClick={open}>
        Kontaktovat
      </Button>

      <Modal
        opened={opened}
        onClose={close}
        title="Kontaktovat prodávajícího"
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
          <input type="hidden" name="toEmail" value={toEmail} />
          <input type="hidden" name="listingTitle" value={listingTitle} />

          <Stack gap="md">
            {error && (
              <Alert color="red" variant="light">
                {error}
              </Alert>
            )}
            {success && (
              <Alert color="green" variant="light">
                ✅ Zpráva byla úspěšně odeslána!
              </Alert>
            )}

            <Text size="sm" c="dimmed">
              Zpráva bude odeslána na: <strong>{toEmail}</strong>
            </Text>

            <TextInput name="fromName" label="Vaše jméno" defaultValue={fromName ?? ""} required />

            <TextInput name="fromEmail" label="Váš e-mail" defaultValue={fromEmail ?? ""} required />

            <Textarea
              name="message"
              label="Zpráva"
              placeholder="Dobrý den, mám zájem o váš inzerát..."
              rows={4}
              required
            />

            <Group justify="flex-end">
              <Button variant="subtle" onClick={close}>
                Zrušit
              </Button>
              <Button type="submit">Odeslat zprávu</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
