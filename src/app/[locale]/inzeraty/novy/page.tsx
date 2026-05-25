/* Stránka pro přídání nového inzerátu */
import { Button, Card, Checkbox, NumberInput, Select, Stack, Text, Textarea, TextInput, Title } from "@mantine/core";
import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { PriceFields } from "@/components/listings/PriceFields";
import { createListing } from "./action";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return { title: t("page.createListing.title") };
}

export default async function Page() {
  const t = await getTranslations();

  return (
    <Stack gap="lg" maw={600} mx="auto">
      <Link href="/cs/inzeraty">
        <Button variant="subtle" size="sm">
          {t("page.createListing.back")}
        </Button>
      </Link>

      <div>
        <Title>{t("page.createListing.title")}</Title>
        <Text c="dimmed">{t("page.createListing.description")}</Text>
      </div>

      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <form action={createListing}>
          <Stack gap="md">
            <TextInput
              name="title"
              label={t("page.createListing.fieldTitle")}
              placeholder="např. Dětská židle"
              required
            />

            <Textarea
              name="description"
              label={t("page.createListing.fieldDescription")}
              placeholder="Popište stav věci, rozměry, důvod prodeje..."
              rows={4}
              required
            />

            <Select
              name="category"
              label={t("page.createListing.fieldCategory")}
              placeholder="Vyberte kategorii"
              required
              data={["Nábytek", "Dětské věci", "Oblečení", "Elektronika", "Knihy", "Ostatní"]}
            />

            <PriceFields
              priceLabel={t("page.createListing.fieldPrice")}
              freeLabel={t("page.createListing.fieldIsFree")}
            />

            <TextInput
              name="contact"
              label={t("page.createListing.fieldContact")}
              placeholder="jmeno@blogic.cz"
              required
            />

            <Button type="submit" fullWidth>
              {t("page.createListing.submit")}
            </Button>
          </Stack>
        </form>
      </Card>
    </Stack>
  );
}
