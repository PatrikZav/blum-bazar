// Úvodní stránka, která uživatele automaticky přesměruje na výchozí jazyk.
import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

export default function RootPage() {
  redirect(routing.defaultLocale);
}
