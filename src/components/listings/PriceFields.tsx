// Komponenta pro zadávání ceny, která umí cenu zablokovat, pokud se věc nabízí zdarma.
"use client";

import { Checkbox, NumberInput } from "@mantine/core";
import { useState } from "react";

interface Props {
  priceLabel: string;
  freeLabel: string;
}

export function PriceFields({ priceLabel, freeLabel }: Props) {
  const [isFree, setIsFree] = useState(false);

  return (
    <>
      <NumberInput name="price" label={priceLabel} placeholder="např. 500" min={0} required={!isFree} />
      <Checkbox name="isFree" label={freeLabel} checked={isFree} onChange={(e) => setIsFree(e.currentTarget.checked)} />
    </>
  );
}
