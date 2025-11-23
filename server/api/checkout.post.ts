// server/api/checkout.post.ts
import { createMollieClient } from '@mollie/api-client'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    price: number
    description?: string
    meta?: Record<string, any>
  }>(event)

  if (!body?.price) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Price is required',
    })
  }

  const config = useRuntimeConfig()

  console.log('🧪 Mollie config:', {
    apiKeyPrefix: config.mollieApiKey?.slice(0, 5), // test_ of live_
    redirect: config.mollieRedirectUrl,
    webhook: config.mollieWebhookUrl,
  })

  if (!config.mollieApiKey) {
    console.error('❌ MOLLIE_API_KEY ontbreekt in runtimeConfig')
    throw createError({
      statusCode: 500,
      statusMessage: 'Betaalconfiguratie ontbreekt (API key).',
    })
  }

  const mollieClient = createMollieClient({ apiKey: config.mollieApiKey })

  const amountStr = body.price.toFixed(2)

  try {
    const payment = await mollieClient.payments.create({
      amount: {
        currency: 'EUR',
        value: amountStr,
      },
      description: body.description || 'Noodpakket op maat',
      redirectUrl: config.mollieRedirectUrl,
      webhookUrl: config.mollieWebhookUrl,
      metadata: body.meta || {},
    })

    // @ts-ignore
    const checkoutUrl = payment.getCheckoutUrl
      ? payment.getCheckoutUrl()
      : payment._links.checkout.href

    return { url: checkoutUrl }
  } catch (err: any) {
    console.error('❌ Mollie betaalfout:', err?.message || err)

    throw createError({
      statusCode: 500,
      statusMessage:
        err?.response?.body?.detail ||
        err?.message ||
        'Kon betaling niet starten bij Mollie.',
    })
  }
})
