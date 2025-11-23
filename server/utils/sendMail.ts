// server/utils/sendMail.ts
type MailInput = {
  to: string
  subject: string
  text: string
  html?: string
}

export async function sendMail({ to, subject, text, html }: MailInput) {
  const config = useRuntimeConfig()

  if (!config.resendApiKey) {
    console.error('❌ RESEND_API_KEY ontbreekt in runtimeConfig')
    return
  }

  const from = config.emailFrom || 'no-reply@donskussen.nl'

  try {
    await $fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: {
        from,
        to,
        subject,
        text,
        // Resend ondersteunt zowel text als html
        ...(html ? { html } : {}),
      },
    })

    console.log(`✉️ Mail verstuurd naar ${to}: "${subject}"`)
  } catch (err: any) {
    console.error('❌ Fout bij versturen mail via Resend:', err?.data || err?.message || err)
  }
}
