import type { PropsWithChildren } from "react";
import { login, logout, register } from "@/app/actions/auth";
import { getSession } from "@/lib/auth";
import { PageLayoutClient } from "./PageLayoutClient";

export async function PageLayout({ children }: PropsWithChildren) {
  const session = await getSession();

  return (
    <PageLayoutClient session={session} login={login} register={register} logout={logout}>
      {children}
    </PageLayoutClient>
  );
}
