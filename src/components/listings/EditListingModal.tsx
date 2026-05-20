"use client";

import { Button, Checkbox, Group, Modal, NumberInput, Select, Stack, Textarea, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useRef } from "react";
import type { Listing } from "@/db/schemas";

interface Props {
  listing: Listing;
  updateListing: (formData: FormData) => Promise<void>;
}

export function EditListingModal({ listing, updateListing }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    await updateListing(formData);
    close();
  }

  return (
    <>
      <Button variant="light" onClick={open}>
        Upravit inzerát
      </Button>

      <Modal opened={opened} onClose={close} title="Upravit inzerát" size="lg">
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

            <Group justify="flex-end">
              <Button variant="subtle" onClick={close}>
                Zrušit
              </Button>
              <Button type="submit">Uložit změny</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
