// server/api/mollie-webhook.post.ts
import { createMollieClient } from '@mollie/api-client'
import { sendMail } from '../utils/sendMail' // pad: server/api -> ../utils/sendMail

// Zelfde labels als in je cart-component
const hygieneLabels: Record<string, string> = {
  handgel: 'Handgel',
  wcpapier: 'Wc-papier',
  doekjes: 'Natte doekjes',
  tandenborstel: 'Tandpasta + tandenborstel',
  maandverband: 'Maandverband',
}

const toolLabels: Record<string, string> = {
  hammer: 'Hamer',
  saw: 'Zaag',
  tang: 'Kniptang',
  opener: 'Blikopener',
}

function getFoodInventoryLabel(meta: any): string {
  const inv = meta?.foodInventory
  if (inv === 'inhouse') return 'Geen voedselpakket'
  if (inv === 'shoppinglist') return 'Ik koop zelf nog voedsel'
  if (inv === 'buy') {
    const count = meta?.foodPackages ?? meta?.persons ?? 1
    return `Noodvoedingspakket voor 72 uur (${count} pakket${count === 1 ? '' : 'ten'})`
  }
  return '-'
}

function buildItemsSummaryText(meta: any, amount: string): string {
  const persons = meta?.persons ?? '-'
  const hygiene = Array.isArray(meta?.hygiene) ? meta.hygiene : []
  const tools = Array.isArray(meta?.tools) ? meta.tools : []

  const lines: string[] = []

  lines.push(`Aantal personen: ${persons}`)
  lines.push(`Totaalbedrag: € ${amount}`)
  lines.push('')
  lines.push('Noodpakket basis:')
  lines.push('- Noodradio')
  lines.push(`- Watervoorziening voor ${persons} personen`)
  lines.push('- EHBO-set')
  lines.push('- Deken')
  lines.push('- Kussen')
  lines.push('- Zaklamp')
  lines.push('- Batterijen')
  lines.push('- Powerbank')
  lines.push('')
  lines.push(`Voedselpakket: ${getFoodInventoryLabel(meta)}`)
  lines.push(`Vluchttas: ${meta?.flightbag === 'yes' ? 'Ja' : 'Geen vluchttas'}`)

  if (hygiene.length) {
    lines.push('')
    lines.push('Hygiëne:')
    hygiene.forEach((key: string) => {
      lines.push(`- ${hygieneLabels[key] || key}`)
    })
  }

  if (tools.length) {
    lines.push('')
    lines.push('Noodgereedschap:')
    tools.forEach((key: string) => {
      lines.push(`- ${toolLabels[key] || key}`)
    })
  }

  return lines.join('\n')
}

function buildItemsSummaryHtml(meta: any, amount: string): string {
  const persons = meta?.persons ?? '-'
  const hygiene = Array.isArray(meta?.hygiene) ? meta.hygiene : []
  const tools = Array.isArray(meta?.tools) ? meta.tools : []

  const hygieneHtml = hygiene.length
    ? `
      <div style="margin-top:12px;">
        <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#111827;">Hygiëne</p>
        <ul style="margin:0;padding-left:18px;font-size:13px;color:#4b5563;">
          ${hygiene
            .map(
              (key: string) =>
                `<li>${hygieneLabels[key] || key}</li>`,
            )
            .join('')}
        </ul>
      </div>
    `
    : ''

  const toolsHtml = tools.length
    ? `
      <div style="margin-top:12px;">
        <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#111827;">Noodgereedschap</p>
        <ul style="margin:0;padding-left:18px;font-size:13px;color:#4b5563;">
          ${tools
            .map(
              (key: string) =>
                `<li>${toolLabels[key] || key}</li>`,
            )
            .join('')}
        </ul>
      </div>
    `
    : ''

  return `
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

    <div style="margin-top:8px;margin-bottom:8px;">
      <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#111827;">
        Noodpakket basis
      </p>
      <ul style="margin:0;padding-left:18px;font-size:13px;color:#4b5563;">
        <li>Noodradio</li>
        <li>Watervoorziening voor ${persons} personen</li>
        <li>EHBO-set</li>
        <li>Deken</li>
        <li>Kussen</li>
        <li>Zaklamp</li>
        <li>Batterijen</li>
        <li>Powerbank</li>
      </ul>
    </div>

    <div style="margin-top:8px;margin-bottom:8px;">
      <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#111827;">
        Voedselpakket
      </p>
      <p style="margin:0;font-size:13px;color:#4b5563;">
        ${getFoodInventoryLabel(meta)}
      </p>
    </div>

    <div style="margin-top:8px;margin-bottom:8px;">
      <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#111827;">
        Vluchttas
      </p>
      <p style="margin:0;font-size:13px;color:#4b5563;">
        ${meta?.flightbag === 'yes' ? 'Ja, vluchttas toegevoegd' : 'Geen vluchttas'}
      </p>
    </div>

    ${hygieneHtml}
    ${toolsHtml}
  `
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  if (!config.mollieApiKey) {
    console.error('❌ MOLLIE_API_KEY ontbreekt in runtimeConfig (webhook)')
    throw createError({
      statusCode: 500,
      statusMessage: 'Betaalconfiguratie ontbreekt (API key).',
    })
  }

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
    const amount = payment.amount.value
    const itemsText = buildItemsSummaryText(meta, amount)
    const itemsHtml = buildItemsSummaryHtml(meta, amount)

    const address = meta?.address || {}
    const customerEmail: string | undefined = address?.email || meta?.email
    const customerName = address?.firstName || 'klant'
    const persons = meta?.persons ?? '-'

    // 1️⃣ Mail naar klant
    if (customerEmail) {
      await sendMail({
        to: customerEmail,
        subject: 'Bevestiging van je noodpakket bestelling',
        text: `
Hi ${customerName},

Bedankt voor je bestelling van het noodpakket op maat.
Hieronder vind je een overzicht van je bestelling.

${itemsText}

Bezorgadres:
${address.firstName || ''} ${address.lastName || ''}
${address.street || ''} ${address.houseNumber || ''}
${address.postalCode || ''} ${address.city || ''}
${address.country || ''}

Je ontvangt een nieuwe e-mail zodra je pakket verzonden is.

Hartelijke groet,
Koen
donskussen.nl
        `.trim(),
        html: `
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
                  Hieronder vind je een overzicht van je bestelling.
                </p>

                ${itemsHtml}

                <div style="margin-top:16px;">
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

                <p style="margin:12px 0 0;font-size:13px;color:#6b7280;">
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
        `.trim(),
      })
    }

    // 2️⃣ Mail naar jou (Koen)
    await sendMail({
      to: 'koen@donskussen.nl',
      subject: `Nieuwe noodpakket bestelling – € ${amount} (${persons} pers)`,
      text: `
Er is een nieuwe betaalde bestelling binnengekomen.

Bedrag: € ${amount}
Status: ${payment.status}

${itemsText}

Klant:
${address.firstName || ''} ${address.lastName || ''}
${address.street || ''} ${address.houseNumber || ''}
${address.postalCode || ''} ${address.city || ''}
${address.country || ''}

E-mailadres klant: ${address.email || customerEmail || '-'}

Volledige metadata:
${JSON.stringify(payment.metadata, null, 2)}
      `.trim(),
      html: `
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
                    Bestelling
                  </p>
                  <pre style="margin:0;padding:8px;border-radius:8px;background:#020617;font-size:11px;color:#9ca3af;white-space:pre-wrap;">
${escapeHtml(itemsText)}
                  </pre>
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
      `.trim(),
    })
  }

  // Mollie verwacht alleen een 200/ok response
  return 'ok'
})
