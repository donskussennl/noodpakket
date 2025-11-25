// server/api/contact.post.ts
import { sendMail } from '../utils/sendMail'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    name?: string
    email?: string
    message?: string
  }>(event)

  const name = body?.name?.trim()
  const email = body?.email?.trim()
  const message = body?.message?.trim()

  if (!name || !email || !message) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Naam, e-mailadres en bericht zijn verplicht.',
    })
  }

  // Mail naar jou
  await sendMail({
    to: 'koen@donskussen.nl', // of 'koen@donskussen.nl'
    subject: `Nieuw bericht via contactformulier van ${name}`,
    text: `
Naam: ${name}
E-mailadres: ${email}

Bericht:
${message}
    `.trim(),
  })

  // (optioneel) bevestiging naar de klant
  await sendMail({
    to: email,
    subject: 'We hebben je bericht ontvangen',
    text: `
Hi ${name},

Bedankt voor je bericht aan noodpakket-op-maat.nl.
We hebben je vraag ontvangen en nemen zo snel mogelijk contact met je op.

Je bericht:
${message}

Hartelijke groet,
Noodpakket-op-maat.nl
    `.trim(),
  })

  return { ok: true }
})
