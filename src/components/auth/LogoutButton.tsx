// Tlačítko, kterým se uživatel odhlásí ze svého účtu.
"use client";

import { Button } from "@mantine/core";

interface Props {
  logout: () => Promise<void>;
}

export function LogoutButton({ logout }: Props) {
  return (
    <form action={logout}>
      <Button type="submit" variant="subtle" size="sm">
        Odhlásit se
      </Button>
    </form>
  );
}
