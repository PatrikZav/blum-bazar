// Zde se řeší odesílání e-mailů, když chce někdo kontaktovat prodejce inzerátu.
"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {
  const toEmail = formData.get("toEmail") as string;
  const fromName = formData.get("fromName") as string;
  const fromEmail = formData.get("fromEmail") as string;
  const listingTitle = formData.get("listingTitle") as string;
  const message = formData.get("message") as string;

  if (!toEmail || !fromEmail || !message) return { error: "Vyplňte všechna pole." };

  try {
    await resend.emails.send({
      from: "Blogic Bazar <onboarding@resend.dev>",
      to: toEmail,
      subject: `Zpráva ohledně inzerátu: ${listingTitle}`,
      html: `
        <h2>Nová zpráva ohledně vašeho inzerátu</h2>
        <p><strong>Inzerát:</strong> ${listingTitle}</p>
        <p><strong>Od:</strong> ${fromName} (${fromEmail})</p>
        <hr />
        <p><strong>Zpráva:</strong></p>
        <p>${message}</p>
        <hr />
        <p>Pro odpověď kontaktujte: <a href="mailto:${fromEmail}">${fromEmail}</a></p>
      `,
    });

    return { success: true };
  } catch {
    return { error: "Nepodařilo se odeslat email." };
  }
}
