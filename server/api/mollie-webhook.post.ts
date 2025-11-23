// server/api/mollie-webhook.post.ts
import { createMollieClient } from '@mollie/api-client'
import { sendMail } from '../utils/sendMail' // let op: pad controleren

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const mollieClient = createMollieClient({
    apiKey: config.mollieApiKey,
  })

  const body = await readBody<{ id?: string }>(event)

  if (!body?.id) {
    console.error('❌ Webhook zonder payment id')
    return 'missing id'
  }

  const payment = await mollieClient.payments.get(body.id)

  console.log('📩 Webhook voor payment:', payment.id, 'status:', payment.status)

  if (payment.status === 'paid') {
    const meta = payment.metadata as any

    const customerEmail: string | undefined = meta?.address?.email
    const customerName = meta?.address?.firstName || 'klant'
    const persons = meta?.persons ?? '-'
    const amount = payment.amount.value
    const address = meta?.address || {}

    // 1️⃣ Mail naar klant
    if (customerEmail) {
      const subject = 'Bevestiging van je noodpakket bestelling'
      const text = `
Hi ${customerName},

Bedankt voor je bestelling van het noodpakket op maat.
We gaan meteen voor je aan de slag.

Samenvatting:
- Aantal personen: ${persons}
- Bedrag: € ${amount}

Bezorgadres:
${address.firstName || ''} ${address.lastName || ''}
${address.street || ''} ${address.houseNumber || ''}
${address.postalCode || ''} ${address.city || ''}
${address.country || ''}

Je ontvangt een nieuwe e-mail zodra je pakket verzonden is.

Hartelijke groet,
Koen
donskussen.nl
      `.trim()

      const html = `
<!doctype html>
<html lang="nl">
  <body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;padding:24px;border:1px solid #e5e7eb;">
            <tr>
              <td style="padding-bottom:16px;border-bottom:1px solid #e5e7eb;">
                <h1 style="margin:0;font-size:20px;color:#111827;">Bevestiging van je bestelling</h1>
                <p style="margin:4px 0 0;font-size:14px;color:#6b7280;">
                  Bedankt voor je bestelling van het noodpakket op maat.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding-top:16px;padding-bottom:16px;">
                <p style="margin:0 0 12px;font-size:14px;color:#111827;">
                  Hi ${customerName},
                </p>
                <p style="margin:0 0 12px;font-size:14px;color:#4b5563;">
                  We gaan meteen voor je aan de slag. Hieronder vind je een overzicht van je bestelling.
                </p>

                <table cellpadding="0" cellspacing="0" style="width:100%;margin-top:8px;margin-bottom:16px;font-size:14px;color:#111827;">
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">Aantal personen</td>
                    <td style="padding:4px 0;text-align:right;font-weight:500;color:#111827;">${persons}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">Totaalbedrag</td>
                    <td style="padding:4px 0;text-align:right;font-weight:600;color:#047857;">€ ${amount}</td>
                  </tr>
                </table>

                <div style="margin-top:8px;margin-bottom:16px;">
                  <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#111827;">
                    Bezorgadres
                  </p>
                  <p style="margin:0;font-size:13px;color:#4b5563;line-height:1.5;">
                    ${address.firstName || ''} ${address.lastName || ''}<br />
                    ${address.street || ''} ${address.houseNumber || ''}<br />
                    ${address.postalCode || ''} ${address.city || ''}<br />
                    ${address.country || ''}
                  </p>
                </div>

                <p style="margin:8px 0 0;font-size:13px;color:#6b7280;">
                  Je ontvangt een nieuwe e-mail zodra je noodpakket verzonden is.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding-top:12px;border-top:1px solid #e5e7eb;">
                <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;">
                  Hartelijke groet,<br />
                  Koen – Noodpakket op Maat
                </p>
                <p style="margin:4px 0 0;font-size:11px;color:#9ca3af;">
                  Deze e-mail is automatisch verstuurd naar ${customerEmail}.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
      `.trim()

      await sendMail({
        to: customerEmail,
        subject,
        text,
        html,
      })
    }

    // 2️⃣ Mail naar jou (Koen)
    {
      const subject = `Nieuwe noodpakket bestelling - € ${amount}`
      const text = `
Er is een nieuwe betaalde bestelling binnengekomen.

Bedrag: € ${amount}
Status: ${payment.status}

Klant:
${address.firstName || ''} ${address.lastName || ''}
${address.street || ''} ${address.houseNumber || ''}
${address.postalCode || ''} ${address.city || ''}
${address.country || ''}

E-mailadres klant: ${address.email || customerEmail || '-'}

Metadata:
${JSON.stringify(payment.metadata, null, 2)}
      `.trim()

      const html = `
<!doctype html>
<html lang="nl">
  <body style="margin:0;padding:0;background:#0b1120;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#020617;border-radius:16px;padding:20px;border:1px solid #1f2937;">
            <tr>
              <td style="padding-bottom:12px;border-bottom:1px solid #111827;">
                <h1 style="margin:0;font-size:18px;color:#e5e7eb;">Nieuwe bestelling – noodpakket</h1>
                <p style="margin:4px 0 0;font-size:12px;color:#9ca3af;">
                  Payment ID: ${payment.id} – Status: ${payment.status}
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding-top:12px;padding-bottom:12px;">
                <table cellpadding="0" cellspacing="0" style="width:100%;font-size:13px;color:#e5e7eb;">
                  <tr>
                    <td style="padding:4px 0;color:#9ca3af;">Bedrag</td>
                    <td style="padding:4px 0;text-align:right;font-weight:600;color:#bbf7d0;">€ ${amount}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#9ca3af;">Aantal personen</td>
                    <td style="padding:4px 0;text-align:right;">${persons}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#9ca3af;">Klant e-mail</td>
                    <td style="padding:4px 0;text-align:right;">${address.email || customerEmail || '-'}</td>
                  </tr>
                </table>

                <div style="margin-top:12px;">
                  <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#e5e7eb;">
                    Bezorgadres
                  </p>
                  <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.5;">
                    ${address.firstName || ''} ${address.lastName || ''}<br />
                    ${address.street || ''} ${address.houseNumber || ''}<br />
                    ${address.postalCode || ''} ${address.city || ''}<br />
                    ${address.country || ''}
                  </p>
                </div>

                <div style="margin-top:12px;">
                  <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#e5e7eb;">
                    Volledige metadata
                  </p>
                  <pre style="margin:0;padding:8px;border-radius:8px;background:#020617;font-size:11px;color:#9ca3af;white-space:pre-wrap;">
${escapeHtml(JSON.stringify(payment.metadata, null, 2))}
                  </pre>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding-top:8px;border-top:1px solid #111827;">
                <p style="margin:0;font-size:11px;color:#6b7280;">
                  Automatische melding vanuit de Mollie webhook.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
      `.trim()

      await sendMail({
        to: 'koen@donskussen.nl',
        subject,
        text,
        html,
      })
    }
  }

  return 'ok'
})

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
