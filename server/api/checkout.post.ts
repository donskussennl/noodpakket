// server/api/checkout.post.ts
import createMollieClient from '@mollie/api-client'

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
  const mollieClient = createMollieClient({
    apiKey: config.mollieApiKey,
  })

  const amountStr = body.price.toFixed(2)

  const payment = await mollieClient.payments.create({
    amount: {
      currency: 'EUR',
      value: amountStr,
    },
    description: body.description || 'Voerbox op maat',
    redirectUrl: config.mollieRedirectUrl,
    webhookUrl: config.mollieWebhookUrl,
    metadata: body.meta || {},
  })

  // Mollie client heeft helper: payment.getCheckoutUrl()
  // of: payment._links.checkout.href
  // beide zijn ok volgens de officiële client. 
  // @ts-ignore – type defs lopen soms achter
  const checkoutUrl = payment.getCheckoutUrl
    ? payment.getCheckoutUrl()
    : payment._links.checkout.href

  return { url: checkoutUrl }
})
