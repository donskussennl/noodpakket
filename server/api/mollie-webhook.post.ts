// server/api/mollie-webhook.post.ts
import { createMollieClient } from '@mollie/api-client'
import { ESSENTIAL_PRODUCTS } from '~/data/essentialProducts'
import { sendMail } from '../utils/sendMail' // pad: server/api -> ../utils/sendMail

// Optionele add-ons (nog uit useIntake.ts)
const HYGIENE_LABELS: Record<string, string> = {
  handgel: 'Handgel',
  wcpapier: 'Wc-papier',
  doekjes: 'Natte doekjes',
  tandenborstel: 'Tandpasta + tandenborstel',
  maandverband: 'Maandverband',
}

const TOOL_LABELS: Record<string, string> = {
  hammer: 'Hamer',
  tang: 'Tang',
  saw: 'Zaag',
  opener: 'Blikopener',
}

type MetaAddress = {
  firstName?: string
  lastName?: string
  email?: string
  street?: string
  houseNumber?: string
  postalCode?: string
  city?: string
  country?: string
  phone?: string
}

type PaymentMeta = {
  persons?: number
  selectedEssentials?: string[] // EssentialProductKey[], maar keep it flexible voor webhook
  hygiene?: string[]
  tools?: string[]
  foodPackages?: number | null
  flightbag?: 'yes' | 'no' | boolean | null
  address?: MetaAddress

  // backward compatibility (oude structuur)
  essentials?: string[]
  items?: Array<{ id: string; qty?: number }>
}

function escapeHtml(input: string) {
  return (input ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

const essentialMap = Object.fromEntries(ESSENTIAL_PRODUCTS.map(p => [p.id, p]))

function getSelectedEssentials(meta: PaymentMeta): string[] {
  if (Array.isArray(meta?.selectedEssentials)) return meta.selectedEssentials
  if (Array.isArray(meta?.essentials)) return meta.essentials
  if (Array.isArray(meta?.items)) return meta.items.map(i => i.id).filter(Boolean)
  return []
}

function toBoolYes(value: any): boolean {
  if (value === true) return true
  if (value === 'yes') return true
  if (value === 'true') return true
  return false
}

function countById(ids: string[]): Record<string, number> {
  return ids.reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + 1
    return acc
  }, {} as Record<string, number>)
}

function buildItemsSummaryText(meta: PaymentMeta, amount: string): string {
  const persons = Number(meta?.persons ?? 1) || 1
  const selected = getSelectedEssentials(meta)
  const essentialsCount = countById(selected)

  const hygiene = Array.isArray(meta?.hygiene) ? meta.hygiene : []
  const tools = Array.isArray(meta?.tools) ? meta.tools : []
  const foodPackages = meta?.foodPackages ?? null
  const flightbag = toBoolYes(meta?.flightbag)

  const lines: string[] = []
  lines.push(`Aantal personen: ${persons}`)
  lines.push(`Totaalbedrag: € ${amount}`)
  lines.push('')

  // Essentials
  if (Object.keys(essentialsCount).length) {
    lines.push('Essentials:')
    for (const [id, baseQty] of Object.entries(essentialsCount)) {
      const product = essentialMap[id]
      if (!product) {
        lines.push(`- ${id} (${baseQty}×)`)
        continue
      }
      const qty = baseQty * (product.multiplies ? persons : 1)
      const spec = product.subLabel ? ` (${product.subLabel})` : ''
      lines.push(`- ${product.label}${spec} (${qty}×)`)
    }
    lines.push('')
  }

  // Food packages
  if (foodPackages && Number(foodPackages) > 0) {
    lines.push(`Voedselpakketten: ${foodPackages}×`)
    lines.push('')
  }

  // Hygiene
  if (hygiene.length) {
    lines.push('Hygiëne:')
    hygiene.forEach(key => lines.push(`- ${HYGIENE_LABELS[key] || key}`))
    lines.push('')
  }

  // Tools
  if (tools.length) {
    lines.push('Tools:')
    tools.forEach(key => lines.push(`- ${TOOL_LABELS[key] || key}`))
    lines.push('')
  }

  // Flightbag
  if (flightbag) {
    lines.push('Vluchttas: Ja')
    lines.push('')
  }

  return lines.join('\n').trim()
}

function buildItemsSummaryHtml(meta: PaymentMeta, amount: string): string {
  const persons = Number(meta?.persons ?? 1) || 1
  const selected = getSelectedEssentials(meta)
  const essentialsCount = countById(selected)

  const hygiene = Array.isArray(meta?.hygiene) ? meta.hygiene : []
  const tools = Array.isArray(meta?.tools) ? meta.tools : []
  const foodPackages = meta?.foodPackages ?? null
  const flightbag = toBoolYes(meta?.flightbag)

  const section = (title: string, inner: string) => `
    <div style="margin-top:14px;">
      <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#111827;">${escapeHtml(title)}</p>
      ${inner}
    </div>
  `

  const list = (items: string[]) => `
    <ul style="margin:0;padding-left:18px;color:#111827;font-size:13px;line-height:1.5;">
      ${items.map(i => `<li>${escapeHtml(i)}</li>`).join('')}
    </ul>
  `

  const parts: string[] = []

  // Totals block
  parts.push(`
    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;color:#111827;">
      <tr>
        <td style="padding:4px 0;color:#6b7280;">Aantal personen</td>
        <td style="padding:4px 0;text-align:right;font-weight:600;">${escapeHtml(String(persons))}</td>
      </tr>
      <tr>
        <td style="padding:4px 0;color:#6b7280;">Totaalbedrag</td>
        <td style="padding:4px 0;text-align:right;font-weight:700;color:#047857;">€ ${escapeHtml(amount)}</td>
      </tr>
    </table>
  `)

  // Essentials
  if (Object.keys(essentialsCount).length) {
    const lines: string[] = []
    for (const [id, baseQty] of Object.entries(essentialsCount)) {
      const product = essentialMap[id]
      if (!product) {
        lines.push(`${id} (${baseQty}×)`)
        continue
      }
      const qty = baseQty * (product.multiplies ? persons : 1)
      const spec = product.subLabel ? ` – ${product.subLabel}` : ''
      lines.push(`${product.label}${spec} (${qty}×)`)
    }
    parts.push(section('Essentials', list(lines)))
  }

  // Food packages
  if (foodPackages && Number(foodPackages) > 0) {
    parts.push(section('Voedselpakketten', list([`${foodPackages}×`])))
  }

  // Hygiene
  if (hygiene.length) {
    parts.push(section('Hygiëne', list(hygiene.map(k => HYGIENE_LABELS[k] || k))))
  }

  // Tools
  if (tools.length) {
    parts.push(section('Tools', list(tools.map(k => TOOL_LABELS[k] || k))))
  }

  // Flightbag
  if (flightbag) {
    parts.push(section('Vluchttas', `<p style="margin:0;color:#111827;font-size:13px;">Ja</p>`))
  }

  return parts.join('')
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  if (!config.mollieApiKey) {
    console.error('❌ MOLLIE_API_KEY ontbreekt in runtimeConfig')
    return 'missing api key'
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
    const meta = (payment.metadata || {}) as PaymentMeta
    const amount = payment.amount?.value ?? '0.00'

    const itemsText = buildItemsSummaryText(meta, amount)
    const itemsHtml = buildItemsSummaryHtml(meta, amount)

    const address = meta?.address || {}
    const customerEmail = address.email || payment.billingEmail || payment.customerId || ''

    // 1) Mail naar klant (als er een mail is)
    if (customerEmail) {
      await sendMail({
        to: customerEmail,
        subject: 'Bevestiging van je bestelling – noodpakket-op-maat.nl',
        text: `
Bedankt voor je bestelling!

${itemsText}

Verzendadres:
${address.firstName || ''} ${address.lastName || ''}
${address.street || ''} ${address.houseNumber || ''}
${address.postalCode || ''} ${address.city || ''}
${address.country || ''}

Hartelijke groet,
Koen
noodpakket-op-maat.nl
        `.trim(),
        html: `
<!doctype html>
<html lang="nl">
  <body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:16px;padding:24px;border:1px solid #e5e7eb;">
            <tr>
              <td style="padding-bottom:14px;border-bottom:1px solid #e5e7eb;">
                <h1 style="margin:0;font-size:18px;line-height:1.3;color:#111827;">Bedankt voor je bestelling!</h1>
                <p style="margin:6px 0 0;font-size:13px;color:#6b7280;">We hebben je betaling ontvangen.</p>
              </td>
            </tr>

            <tr>
              <td style="padding-top:14px;">
                ${itemsHtml}
              </td>
            </tr>

            <tr>
              <td style="padding-top:14px;border-top:1px solid #e5e7eb;">
                <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#111827;">Verzendadres</p>
                <p style="margin:0;font-size:13px;color:#111827;line-height:1.5;">
                  ${escapeHtml(`${address.firstName || ''} ${address.lastName || ''}`)}<br/>
                  ${escapeHtml(`${address.street || ''} ${address.houseNumber || ''}`)}<br/>
                  ${escapeHtml(`${address.postalCode || ''} ${address.city || ''}`)}<br/>
                  ${escapeHtml(`${address.country || ''}`)}
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding-top:14px;border-top:1px solid #111827;">
                <p style="margin:0;font-size:11px;color:#6b7280;">
                  Je ontvangt een nieuwe e-mail zodra je pakket verzonden is.
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

    // 2) Interne admin mail (altijd, als je die hebt)
    const adminEmail = config.adminEmail || config.public?.adminEmail
    if (adminEmail) {
      await sendMail({
        to: adminEmail,
        subject: `✅ Betaald via Mollie: ${payment.id}`,
        text: `
Nieuwe betaalde bestelling.

Payment: ${payment.id}
Status: ${payment.status}
Bedrag: € ${amount}

Bestelling:
${itemsText}

Adres:
${address.firstName || ''} ${address.lastName || ''}
${address.street || ''} ${address.houseNumber || ''}
${address.postalCode || ''} ${address.city || ''}
${address.country || ''}

Metadata:
${JSON.stringify(payment.metadata, null, 2)}
        `.trim(),
        html: `
<!doctype html>
<html lang="nl">
  <body style="margin:0;padding:0;background:#0b1220;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:720px;background:#0f172a;border-radius:16px;padding:18px;border:1px solid #1f2937;color:#e5e7eb;">
            <tr>
              <td style="padding-bottom:12px;border-bottom:1px solid #1f2937;">
                <h1 style="margin:0;font-size:16px;color:#e5e7eb;">Nieuwe betaalde bestelling</h1>
                <p style="margin:6px 0 0;font-size:12px;color:#9ca3af;">Automatische melding vanuit de Mollie webhook.</p>
              </td>
            </tr>

            <tr>
              <td style="padding-top:12px;">
                <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#e5e7eb;">Payment</p>
                <pre style="margin:0;padding:8px;border-radius:10px;background:#020617;font-size:11px;color:#9ca3af;white-space:pre-wrap;">${escapeHtml(`id: ${payment.id}\nstatus: ${payment.status}\nbedrag: € ${amount}`)}</pre>
              </td>
            </tr>

            <tr>
              <td style="padding-top:12px;">
                <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#e5e7eb;">Bestelling</p>
                <pre style="margin:0;padding:8px;border-radius:10px;background:#020617;font-size:11px;color:#9ca3af;white-space:pre-wrap;">${escapeHtml(itemsText)}</pre>
              </td>
            </tr>

            <tr>
              <td style="padding-top:12px;">
                <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#e5e7eb;">Volledige metadata</p>
                <pre style="margin:0;padding:8px;border-radius:10px;background:#020617;font-size:11px;color:#9ca3af;white-space:pre-wrap;">${escapeHtml(JSON.stringify(payment.metadata, null, 2))}</pre>
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
  }

  // Mollie verwacht alleen een 200/ok response
  return 'ok'
})
