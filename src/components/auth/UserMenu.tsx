"use client";

import { Alert, Button, Divider, Group, Menu, Modal, PasswordInput, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminUsersModal } from "@/components/auth/AdminUsersModal";

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
  changePassword: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
  deleteAccount: (formData: FormData) => Promise<{ error?: string } | void>;
  getAllUsers: () => Promise<{
    users?: { id: number; firstName: string; lastName: string; email: string; role: string; createdAt: Date }[];
    error?: string;
  }>;
  adminChangePassword: (userId: number, newPassword: string) => Promise<{ success?: boolean; error?: string }>;
  adminChangeRole: (userId: number, newRole: string) => Promise<{ success?: boolean; error?: string }>;
  adminDeleteUser: (userId: number) => Promise<{ success?: boolean; error?: string }>;
}

export function UserMenu({
  session,
  logout,
  changePassword,
  deleteAccount,
  getAllUsers,
  adminChangePassword,
  adminChangeRole,
  adminDeleteUser,
}: Props) {
  const router = useRouter();
  const [settingsOpened, { open: openSettings, close: closeSettings }] = useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [adminOpened, { open: openAdmin, close: closeAdmin }] = useDisclosure(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleChangePassword(formData: FormData) {
    setPasswordError(null);
    setPasswordSuccess(false);
    const result = await changePassword(formData);
    if (result?.error) {
      setPasswordError(result.error);
    } else {
      setPasswordSuccess(true);
    }
  }

  async function handleDeleteAccount(formData: FormData) {
    setDeleteError(null);
    const result = await deleteAccount(formData);
    if (result && "error" in result && result.error) {
      setDeleteError(result.error);
    }
  }

  return (
    <>
      <Menu shadow="md" width={200} position="bottom-end">
        <Menu.Target>
          <Button variant="outline" size="sm">
            {session.firstName} {session.lastName}
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item onClick={() => router.push(`/cs/inzeraty?userId=${session.id}`)}>Moje inzeráty</Menu.Item>

          <Menu.Item onClick={() => router.push(`/cs/inzeraty?oblibene=1`)}>Oblíbené</Menu.Item>

          <Menu.Divider />

          <Menu.Item onClick={openSettings}>Nastavení účtu</Menu.Item>

          {session.role === "admin" && <Menu.Item onClick={openAdmin}>Správa uživatelů</Menu.Item>}

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

      {/* Nastavení účtu Modal */}
      <Modal
        opened={settingsOpened}
        onClose={closeSettings}
        title="Nastavení účtu"
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
        <Stack gap="md">
          <Text fw={600}>Změna hesla</Text>

          {passwordError && (
            <Alert color="red" variant="light">
              {passwordError}
            </Alert>
          )}
          {passwordSuccess && (
            <Alert color="green" variant="light">
              Heslo bylo úspěšně změněno.
            </Alert>
          )}

          <form action={handleChangePassword}>
            <Stack gap="sm">
              <PasswordInput name="currentPassword" label="Současné heslo" required />
              <PasswordInput name="newPassword" label="Nové heslo" required />
              <PasswordInput name="confirmPassword" label="Potvrďte nové heslo" required />
              <Button type="submit" fullWidth>
                Změnit heslo
              </Button>
            </Stack>
          </form>

          <Divider />

          <Text fw={600} c="red">
            Smazat účet
          </Text>
          <Text size="sm" c="dimmed">
            Tato akce je nevratná. Váš účet bude trvale smazán.
          </Text>

          <Button
            color="red"
            variant="light"
            fullWidth
            onClick={() => {
              closeSettings();
              openDelete();
            }}
          >
            Smazat účet
          </Button>
        </Stack>
      </Modal>

      {/* Potvrzení smazání Modal */}
      <Modal
        opened={deleteOpened}
        onClose={closeDelete}
        title="Opravdu chcete smazat účet?"
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
        <Stack gap="md">
          <Text size="sm">Pro potvrzení zadejte své heslo.</Text>

          {deleteError && (
            <Alert color="red" variant="light">
              {deleteError}
            </Alert>
          )}

          <form action={handleDeleteAccount}>
            <Stack gap="sm">
              <PasswordInput name="password" label="Heslo" required />
              <Group justify="space-between">
                <Button variant="subtle" onClick={closeDelete}>
                  Zrušit
                </Button>
                <Button type="submit" color="red">
                  Smazat účet
                </Button>
              </Group>
            </Stack>
          </form>
        </Stack>
      </Modal>

      {session.role === "admin" && (
        <AdminUsersModal
          opened={adminOpened}
          onClose={closeAdmin}
          getAllUsers={getAllUsers}
          adminChangePassword={adminChangePassword}
          adminChangeRole={adminChangeRole}
          adminDeleteUser={adminDeleteUser}
          currentUserId={session.id}
        />
      )}
    </>
  );
}
