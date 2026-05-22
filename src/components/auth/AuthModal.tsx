"use client";

import { Alert, Button, Divider, Modal, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

interface Props {
  login: (formData: FormData) => Promise<{ error: string } | void>;
  register: (formData: FormData) => Promise<{ error: string } | void>;
}

export function AuthModal({ login, register }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = mode === "login" ? await login(formData) : await register(formData);

    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <>
      <Button variant="subtle" size="sm" onClick={open}>
        Přihlásit se
      </Button>

      <Modal
        opened={opened}
        onClose={close}
        title={mode === "login" ? "Přihlášení" : "Registrace"}
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
        <form action={handleSubmit}>
          <Stack gap="md">
            {error && (
              <Alert color="red" variant="light">
                {error}
              </Alert>
            )}

            {mode === "register" && (
              <>
                <TextInput name="firstName" label="Jméno" placeholder="Jan" required />
                <TextInput name="lastName" label="Příjmení" placeholder="Novák" required />
              </>
            )}

            <TextInput name="email" label="E-mail" placeholder="jan@blogic.cz" required />
            <PasswordInput name="password" label="Heslo" placeholder="••••••••" required />

            <Button type="submit" fullWidth>
              {mode === "login" ? "Přihlásit se" : "Zaregistrovat se"}
            </Button>

            <Divider />

            {mode === "login" ? (
              <Text size="sm" ta="center">
                Nemáte účet?{" "}
                <Text
                  component="span"
                  c="orange"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setMode("register");
                    setError(null);
                  }}
                >
                  Zaregistrujte se
                </Text>
              </Text>
            ) : (
              <Text size="sm" ta="center">
                Již máte účet?{" "}
                <Text
                  component="span"
                  c="orange"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setMode("login");
                    setError(null);
                  }}
                >
                  Přihlaste se
                </Text>
              </Text>
            )}
          </Stack>
        </form>
      </Modal>
    </>
  );
}
