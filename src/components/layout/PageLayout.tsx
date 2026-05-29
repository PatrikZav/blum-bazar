// Základní kostra stránky, která obsahuje hlavičku, hlavní obsah a případně patičku.
import type { PropsWithChildren } from "react";
import { changePassword, deleteAccount } from "@/app/actions/account";
import { adminChangePassword, adminChangeRole, adminDeleteUser, getAllUsers } from "@/app/actions/admin";
import { login, logout, register } from "@/app/actions/auth";
import { getSession } from "@/lib/auth";
import { PageLayoutClient } from "./PageLayoutClient";

export async function PageLayout({ children }: PropsWithChildren) {
  const session = await getSession();

  return (
    <PageLayoutClient
      session={session}
      login={login}
      register={register}
      logout={logout}
      changePassword={changePassword}
      deleteAccount={deleteAccount}
      getAllUsers={getAllUsers}
      adminChangePassword={adminChangePassword}
      adminChangeRole={adminChangeRole}
      adminDeleteUser={adminDeleteUser}
    >
      {children}
    </PageLayoutClient>
  );
}
