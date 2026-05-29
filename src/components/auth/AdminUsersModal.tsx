// Vyskakovací okno pro administrátora, kde vidí všechny uživatele a může je spravovat.
"use client";

import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Group,
  Modal,
  PasswordInput,
  ScrollArea,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useCallback, useEffect, useState } from "react";

interface UserRecord {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: Date;
}

interface Props {
  opened: boolean;
  onClose: () => void;
  getAllUsers: () => Promise<{ users?: UserRecord[]; error?: string }>;
  adminChangePassword: (userId: number, newPassword: string) => Promise<{ success?: boolean; error?: string }>;
  adminChangeRole: (userId: number, newRole: string) => Promise<{ success?: boolean; error?: string }>;
  adminDeleteUser: (userId: number) => Promise<{ success?: boolean; error?: string }>;
  currentUserId: number;
}

export function AdminUsersModal({
  opened,
  onClose,
  getAllUsers,
  adminChangePassword,
  adminChangeRole,
  adminDeleteUser,
  currentUserId,
}: Props) {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Password change state
  const [passwordUserId, setPasswordUserId] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Delete confirmation state
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);

  // Search state
  const [search, setSearch] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getAllUsers();
    if (result.error) {
      setError(result.error);
    } else if (result.users) {
      setUsers(result.users);
    }
    setLoading(false);
  }, [getAllUsers]);

  useEffect(() => {
    if (opened) {
      loadUsers();
    }
  }, [opened, loadUsers]);

  function showSuccess(msg: string) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  }

  async function handleChangeRole(userId: number, newRole: string) {
    setError(null);
    const result = await adminChangeRole(userId, newRole);
    if (result.error) {
      setError(result.error);
    } else {
      showSuccess("Role byla změněna.");
      await loadUsers();
    }
  }

  async function handleChangePassword() {
    if (!passwordUserId) return;
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Hesla se neshodují.");
      return;
    }

    const result = await adminChangePassword(passwordUserId, newPassword);
    if (result.error) {
      setError(result.error);
    } else {
      showSuccess("Heslo bylo změněno.");
      setPasswordUserId(null);
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  async function handleDeleteUser() {
    if (!deleteUserId) return;
    setError(null);

    const result = await adminDeleteUser(deleteUserId);
    if (result.error) {
      setError(result.error);
    } else {
      showSuccess("Uživatel byl smazán.");
      setDeleteUserId(null);
      await loadUsers();
    }
  }

  const filteredUsers = users.filter((u) => {
    const term = search.toLowerCase();
    return (
      u.firstName.toLowerCase().includes(term) ||
      u.lastName.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
    );
  });

  const deleteUser = users.find((u) => u.id === deleteUserId);
  const passwordUser = users.find((u) => u.id === passwordUserId);

  const modalStyles = {
    content: {
      background: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(24px) saturate(180%)",
      WebkitBackdropFilter: "blur(24px) saturate(180%)",
      border: "1px solid rgba(255, 255, 255, 0.5)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
    },
    header: { background: "transparent" },
  };

  return (
    <>
      {/* Main user management modal */}
      <Modal
        opened={opened}
        onClose={onClose}
        title="Správa uživatelů"
        size="xl"
        overlayProps={{ backgroundOpacity: 0.35, blur: 8 }}
        styles={modalStyles}
      >
        <Stack gap="md">
          {error && (
            <Alert color="red" variant="light" withCloseButton onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          {successMsg && (
            <Alert color="green" variant="light">
              {successMsg}
            </Alert>
          )}

          <TextInput
            placeholder="Hledat uživatele…"
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />

          <ScrollArea h={400}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Jméno</Table.Th>
                  <Table.Th>E-mail</Table.Th>
                  <Table.Th>Role</Table.Th>
                  <Table.Th style={{ textAlign: "right" }}>Akce</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {loading ? (
                  <Table.Tr>
                    <Table.Td colSpan={4}>
                      <Text ta="center" c="dimmed" py="md">
                        Načítání…
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ) : filteredUsers.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={4}>
                      <Text ta="center" c="dimmed" py="md">
                        Žádní uživatelé nenalezeni.
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  filteredUsers.map((u) => (
                    <Table.Tr key={u.id}>
                      <Table.Td>
                        <Text size="sm" fw={500}>
                          {u.firstName} {u.lastName}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">
                          {u.email}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Tooltip
                          label={u.id === currentUserId ? "Nemůžete změnit vlastní roli" : "Klikněte pro změnu role"}
                        >
                          <Badge
                            color={u.role === "admin" ? "violet" : "blue"}
                            variant="light"
                            style={{
                              cursor: u.id === currentUserId ? "not-allowed" : "pointer",
                            }}
                            onClick={() => {
                              if (u.id !== currentUserId) {
                                handleChangeRole(u.id, u.role === "admin" ? "user" : "admin");
                              }
                            }}
                          >
                            {u.role}
                          </Badge>
                        </Tooltip>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs" justify="flex-end">
                          <Tooltip label="Změnit heslo">
                            <Button
                              variant="light"
                              size="compact-sm"
                              onClick={() => {
                                setPasswordUserId(u.id);
                                setNewPassword("");
                                setConfirmPassword("");
                                setError(null);
                              }}
                            >
                              Heslo
                            </Button>
                          </Tooltip>
                          <Tooltip label={u.id === currentUserId ? "Nemůžete smazat vlastní účet" : "Smazat uživatele"}>
                            <Button
                              variant="light"
                              color="red"
                              size="compact-sm"
                              disabled={u.id === currentUserId}
                              onClick={() => setDeleteUserId(u.id)}
                            >
                              Smazat
                            </Button>
                          </Tooltip>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>

          <Text size="xs" c="dimmed" ta="right">
            Celkem uživatelů: {users.length}
          </Text>
        </Stack>
      </Modal>

      {/* Change password modal */}
      <Modal
        opened={passwordUserId !== null}
        onClose={() => {
          setPasswordUserId(null);
          setNewPassword("");
          setConfirmPassword("");
          setError(null);
        }}
        title={`Změna hesla – ${passwordUser ? `${passwordUser.firstName} ${passwordUser.lastName}` : ""}`}
        size="sm"
        overlayProps={{ backgroundOpacity: 0.35, blur: 8 }}
        styles={modalStyles}
      >
        <Stack gap="md">
          {error && (
            <Alert color="red" variant="light">
              {error}
            </Alert>
          )}

          <PasswordInput
            label="Nové heslo"
            value={newPassword}
            onChange={(e) => setNewPassword(e.currentTarget.value)}
            required
          />
          <PasswordInput
            label="Potvrďte nové heslo"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.currentTarget.value)}
            required
          />

          <Group justify="space-between">
            <Button
              variant="subtle"
              onClick={() => {
                setPasswordUserId(null);
                setNewPassword("");
                setConfirmPassword("");
                setError(null);
              }}
            >
              Zrušit
            </Button>
            <Button onClick={handleChangePassword}>Změnit heslo</Button>
          </Group>
        </Stack>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        opened={deleteUserId !== null}
        onClose={() => setDeleteUserId(null)}
        title="Opravdu chcete smazat tohoto uživatele?"
        size="sm"
        overlayProps={{ backgroundOpacity: 0.35, blur: 8 }}
        styles={modalStyles}
      >
        <Stack gap="md">
          {deleteUser && (
            <Text size="sm">
              Chystáte se smazat účet uživatele{" "}
              <Text span fw={700}>
                {deleteUser.firstName} {deleteUser.lastName}
              </Text>{" "}
              ({deleteUser.email}). Tato akce je nevratná.
            </Text>
          )}

          {error && (
            <Alert color="red" variant="light">
              {error}
            </Alert>
          )}

          <Group justify="space-between">
            <Button variant="subtle" onClick={() => setDeleteUserId(null)}>
              Zrušit
            </Button>
            <Button color="red" onClick={handleDeleteUser}>
              Smazat uživatele
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
