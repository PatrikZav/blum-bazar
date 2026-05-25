"use client";

import { Alert, Button, Divider, Group, Menu, Modal, PasswordInput, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

interface Props {
  changePassword: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
  deleteAccount: (formData: FormData) => Promise<{ error?: string } | void>;
}

export function AccountSettingsModal({ changePassword, deleteAccount }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
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
      <Menu.Item onClick={open}>Nastavení účtu</Menu.Item>

      <Modal
        opened={opened}
        onClose={close}
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
              close();
              openDelete();
            }}
          >
            Smazat účet
          </Button>
        </Stack>
      </Modal>

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
    </>
  );
}
