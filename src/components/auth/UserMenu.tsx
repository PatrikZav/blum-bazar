"use client";

import { Button, Menu } from "@mantine/core";
import { useRouter } from "next/navigation";

interface Session {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface Props {
  session: Session;
  logout: () => Promise<void>;
}

export function UserMenu({ session, logout }: Props) {
  const router = useRouter();

  return (
    <Menu shadow="md" width={200} position="bottom-end">
      <Menu.Target>
        <Button variant="outline" size="sm">
          {session.firstName} {session.lastName}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item onClick={() => router.push(`/cs/inzeraty?userId=${session.id}`)}>Moje inzeráty</Menu.Item>

        <Menu.Divider />

        <Menu.Item
          color="red"
          onClick={async () => {
            await logout();
          }}
        >
          Odhlásit se
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
