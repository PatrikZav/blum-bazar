// Vyskakovací okno s formulářem, ve kterém uživatel zadává informace pro nový inzerát.
"use client";

import {
  Alert,
  Button,
  Checkbox,
  Group,
  Modal,
  NumberInput,
  SegmentedControl,
  Select,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LocationPicker } from "./LocationPicker";

interface Props {
  createListing: (formData: FormData) => Promise<void>;
  userEmail?: string;
}

export function CreateListingModal({ createListing, userEmail }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const [imageSelected, setImageSelected] = useState(false);
  const [imageMode, setImageMode] = useState<"file" | "url">("file");
  const [isFree, setIsFree] = useState(false);
  const [price, setPrice] = useState<string | number>("");
  const [accountNumber, setAccountNumber] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("novy") === "1") {
      open();
    }
  }, [searchParams, open]);

  async function handleSubmit(formData: FormData) {
    await createListing(formData);
    close();
    setImageSelected(false);
    setImageMode("file");
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setImageSelected(!!e.target.files?.[0]);
  }

  function handleRemoveImage() {
    if (fileInputRef.current) fileInputRef.current.value = "";
    setImageSelected(false);
  }

  return (
    <>
      <Button size="md" onClick={open}>
        Přidat inzerát
      </Button>

      <Modal
        opened={opened}
        onClose={close}
        title="Nový inzerát"
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
        <form action={handleSubmit}>
          <input type="hidden" name="imageMode" value={imageMode} />
          <Stack gap="md">
            <TextInput name="title" label="Název věci" placeholder="např. Dětská židle" required />

            <Textarea name="description" label="Popis" placeholder="Popište stav věci..." rows={4} required />

            <Select
              name="category"
              label="Kategorie"
              placeholder="Vyberte kategorii"
              required
              data={["Nábytek", "Dětské věci", "Oblečení", "Elektronika", "Knihy", "Ostatní"]}
            />

            <NumberInput
              name="price"
              label="Cena (Kč)"
              placeholder="např. 500"
              min={0}
              required={!isFree}
              value={price}
              onChange={(val) => setPrice(val)}
              disabled={isFree}
            />

            <Checkbox
              name="isFree"
              label="Nabízím zdarma"
              checked={isFree}
              onChange={(e) => {
                const checked = e.currentTarget.checked;
                setIsFree(checked);
                if (checked) {
                  setPrice("");
                  setAccountNumber("");
                }
              }}
            />

            <TextInput
              name="contact"
              label="Kontakt (e-mail)"
              placeholder="jmeno@blogic.cz"
              defaultValue={userEmail ?? ""}
              required
            />

            <Stack gap="xs">
              <SegmentedControl
                value={imageMode}
                onChange={(val) => {
                  setImageMode(val as "file" | "url");
                  setImageSelected(false);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                data={[
                  { label: "Nahrát ze zařízení", value: "file" },
                  { label: "Zadat URL", value: "url" },
                ]}
                fullWidth
              />

              {imageMode === "file" ? (
                <Stack gap={4}>
                  <input
                    ref={fileInputRef}
                    name="image"
                    type="file"
                    accept="image/*"
                    id="image-upload-create"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  <Group gap="xs">
                    <label htmlFor="image-upload-create" style={{ flex: 1 }}>
                      <Button component="span" variant="light" fullWidth style={{ cursor: "pointer" }}>
                        📷 Nahrát obrázek
                      </Button>
                    </label>
                    {imageSelected && (
                      <Button color="red" variant="light" onClick={handleRemoveImage} style={{ flexShrink: 0 }}>
                        🗑️
                      </Button>
                    )}
                  </Group>
                  {imageSelected && (
                    <Alert color="green" variant="light">
                      ✅ Obrázek byl vybrán.
                    </Alert>
                  )}
                </Stack>
              ) : (
                <TextInput name="imageUrl" placeholder="https://example.com/obrazek.jpg" label="URL obrázku" />
              )}
            </Stack>

            <TextInput
              name="accountNumber"
              label="Číslo účtu pro platbu (volitelné)"
              placeholder="např. 123456789/0800"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.currentTarget.value)}
              disabled={isFree}
              pattern="^([0-9]{1,6}-)?[0-9]{2,10}/[0-9]{4}$"
              title="Zadejte platné číslo účtu ve formátu 123456789/0800 (případně i s předčíslím)"
            />

            <LocationPicker />

            <Group justify="flex-end">
              <Button variant="subtle" onClick={close}>
                Zrušit
              </Button>
              <Button type="submit">Přidat inzerát</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
