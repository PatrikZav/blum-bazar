"use client";

import { AppShell, Container, Group } from "@mantine/core";
import type { PropsWithChildren } from "react";
import { AuthModal } from "@/components/auth/AuthModal";
import { UserMenu } from "@/components/auth/UserMenu";
import { PageLogo } from "@/components/layout/PageLogo";

interface Session {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface Props extends PropsWithChildren {
  session: Session | null;
  login: (formData: FormData) => Promise<{ error: string } | void>;
  register: (formData: FormData) => Promise<{ error: string } | void>;
  logout: () => Promise<void>;
  changePassword: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
  deleteAccount: (formData: FormData) => Promise<{ error?: string } | void>;
}

const HEADER_HEIGHT = 90;
const BODY_MAX_WIDTH = 1280;

export function PageLayoutClient({ children, session, login, register, logout, changePassword, deleteAccount }: Props) {
  return (
    <AppShell header={{ height: HEADER_HEIGHT }} padding="md" withBorder={false}>
      <AppShell.Header px="md">
        <Container size={BODY_MAX_WIDTH} h="100%">
          <Group h="100%" align="center" justify="space-between">
            <PageLogo />
            <Group>
              {session ? (
                <UserMenu
                  session={session}
                  logout={logout}
                  changePassword={changePassword}
                  deleteAccount={deleteAccount}
                />
              ) : (
                <AuthModal login={login} register={register} />
              )}
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Container size={BODY_MAX_WIDTH} px="md">
          {children}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
