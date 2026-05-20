"use client";

import { Button, Checkbox, Group, Modal, NumberInput, Select, Stack, Textarea, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface Props {
  createListing: (formData: FormData) => Promise<void>;
}

export function CreateListingModal({ createListing }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("novy") === "1") {
      open();
    }
  }, [searchParams, open]);

  async function handleSubmit(formData: FormData) {
    await createListing(formData);
    close();
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
        overlayProps={{
          backgroundOpacity: 0.35,
          blur: 8,
        }}
        styles={{
          content: {
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.5)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          },
          header: {
            background: "transparent",
          },
        }}
      >
        <form action={handleSubmit}>
          <Stack gap="md">
            <TextInput name="title" label="Název věci" placeholder="např. Dětská židle" required />

            <Textarea
              name="description"
              label="Popis"
              placeholder="Popište stav věci, rozměry, důvod prodeje..."
              rows={4}
              required
            />

            <Select
              name="category"
              label="Kategorie"
              placeholder="Vyberte kategorii"
              required
              data={["Nábytek", "Dětské věci", "Oblečení", "Elektronika", "Knihy", "Ostatní"]}
            />

            <NumberInput name="price" label="Cena (Kč)" placeholder="např. 500" min={0} />

            <Checkbox name="isFree" label="Nabízím zdarma" />

            <TextInput name="contact" label="Kontakt (e-mail)" placeholder="jmeno@blogic.cz" required />

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
