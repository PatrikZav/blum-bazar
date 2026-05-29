// Tlačítko ve tvaru srdíčka, kterým si uživatel ukládá inzerát do oblíbených.
"use client";

import { ActionIcon } from "@mantine/core";

interface Props {
  listingId: number;
  isFavorited: boolean;
  toggleFavorite: (listingId: number) => Promise<void>;
}

export function FavoriteButton({ listingId, isFavorited, toggleFavorite }: Props) {
  return (
    <ActionIcon
      variant="light"
      color="red"
      size="md"
      onClick={async () => {
        await toggleFavorite(listingId);
      }}
    >
      {isFavorited ? "❤️" : "🤍"}
    </ActionIcon>
  );
}
