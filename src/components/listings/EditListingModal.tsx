"use client";

import { Alert, Button, Checkbox, Group, Modal, NumberInput, Select, Stack, Textarea, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useRef, useState } from "react";
import type { Listing } from "@/db/schemas";

interface Props {
  listing: Listing;
  updateListing: (formData: FormData) => Promise<void>;
  deleteListing: (formData: FormData) => Promise<void>;
  removeListingImage: (formData: FormData) => Promise<void>;
  removeListingQr: (formData: FormData) => Promise<void>;
}

export function EditListingModal({
  listing,
  updateListing,
  deleteListing,
  removeListingImage,
  removeListingQr,
}: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const [imageSelected, setImageSelected] = useState(false);
  const [qrSelected, setQrSelected] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const qrInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(formData: FormData) {
    await updateListing(formData);
    close();
    setImageSelected(false);
    setQrSelected(false);
  }

  async function handleDelete() {
    const formData = new FormData();
    formData.append("id", String(listing.id));
    await deleteListing(formData);
  }

  async function handleRemoveImage() {
    if (fileInputRef.current) fileInputRef.current.value = "";
    setImageSelected(false);
    if (listing.image) {
      const formData = new FormData();
      formData.append("id", String(listing.id));
      await removeListingImage(formData);
    }
  }

  async function handleRemoveQr() {
    if (qrInputRef.current) qrInputRef.current.value = "";
    setQrSelected(false);
    if (listing.qrCode) {
      const formData = new FormData();
      formData.append("id", String(listing.id));
      await removeListingQr(formData);
    }
  }

  return (
    <>
      <Button variant="light" onClick={open}>
        Upravit inzerát
      </Button>

      <Modal
        opened={opened}
        onClose={close}
        title="Upravit inzerát"
        size="lg"
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
        <form ref={formRef} action={handleSubmit}>
          <input type="hidden" name="id" value={listing.id} />
          <Stack gap="md">
            <TextInput name="title" label="Název věci" defaultValue={listing.title} required />

            <Textarea name="description" label="Popis" defaultValue={listing.description} rows={4} required />

            <Select
              name="category"
              label="Kategorie"
              defaultValue={listing.category}
              required
              data={["Nábytek", "Dětské věci", "Oblečení", "Elektronika", "Knihy", "Ostatní"]}
            />

            <Select
              name="status"
              label="Stav"
              defaultValue={listing.status}
              required
              data={["Dostupné", "Rezervováno", "Prodáno / předáno"]}
            />

            <NumberInput name="price" label="Cena (Kč)" defaultValue={listing.price ?? undefined} min={0} />

            <Checkbox name="isFree" label="Nabízím zdarma" defaultChecked={listing.isFree} />

            <TextInput name="contact" label="Kontakt (e-mail)" defaultValue={listing.contact} required />

            <Stack gap={4}>
              <input
                ref={fileInputRef}
                name="image"
                type="file"
                accept="image/*"
                id="image-upload-edit"
                style={{ display: "none" }}
                onChange={() => setImageSelected(true)}
              />
              <Group gap="xs">
                <label htmlFor="image-upload-edit" style={{ flex: 1 }}>
                  <Button component="span" variant="light" fullWidth style={{ cursor: "pointer" }}>
                    📷 {listing.image ? "Změnit obrázek" : "Nahrát obrázek"}
                  </Button>
                </label>
                {(listing.image || imageSelected) && (
                  <Button color="red" variant="light" onClick={handleRemoveImage} style={{ flexShrink: 0 }}>
                    🗑️
                  </Button>
                )}
              </Group>
              {listing.image && !imageSelected && (
                <Alert color="blue" variant="light">
                  ✅ Obrázek je nahrán.
                </Alert>
              )}
              {imageSelected && (
                <Alert color="green" variant="light">
                  ✅ Nový obrázek byl vybrán.
                </Alert>
              )}
            </Stack>

            <Stack gap={4}>
              <input
                ref={qrInputRef}
                name="qrCode"
                type="file"
                accept="image/*"
                id="qr-upload-edit"
                style={{ display: "none" }}
                onChange={() => setQrSelected(true)}
              />
              <Group gap="xs">
                <label htmlFor="qr-upload-edit" style={{ flex: 1 }}>
                  <Button component="span" variant="light" fullWidth style={{ cursor: "pointer" }}>
                    💳 {listing.qrCode ? "Změnit QR kód" : "Nahrát QR kód platby"}
                  </Button>
                </label>
                {(listing.qrCode || qrSelected) && (
                  <Button color="red" variant="light" onClick={handleRemoveQr} style={{ flexShrink: 0 }}>
                    🗑️
                  </Button>
                )}
              </Group>
              {listing.qrCode && !qrSelected && (
                <Alert color="blue" variant="light">
                  ✅ QR kód je nahrán.
                </Alert>
              )}
              {qrSelected && (
                <Alert color="green" variant="light">
                  ✅ Nový QR kód byl vybrán.
                </Alert>
              )}
            </Stack>

            <TextInput
              name="accountNumber"
              label="Číslo účtu (volitelné)"
              defaultValue={listing.accountNumber ?? ""}
              placeholder="např. 123456789/0800"
            />

            <Group justify="space-between">
              <Button color="red" variant="light" onClick={handleDelete}>
                Smazat inzerát
              </Button>
              <Group>
                <Button variant="subtle" onClick={close}>
                  Zrušit
                </Button>
                <Button type="submit">Uložit změny</Button>
              </Group>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
