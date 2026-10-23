import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder'

export const stripe = new Stripe(stripeSecretKey, {
  httpClient: Stripe.createFetchHttpClient(),
})

export interface CreateInvoiceCheckoutParams {
  invoiceId: string | number
  invoiceNumber: string
  clientEmail: string
  clientName: string
  amount: number
  currency: 'gbp' | 'usd' | 'eur'
  title: string
  successUrl: string
  cancelUrl: string
}

export async function createInvoiceCheckoutSession(params: CreateInvoiceCheckoutParams) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }

  const session = await stripe.checkout.sessions.create({
    customer_email: params.clientEmail,
    client_reference_id: String(params.invoiceId),
    line_items: [
      {
        price_data: {
          currency: params.currency.toLowerCase(),
          product_data: {
            name: `${params.invoiceNumber} — ${params.title}`,
            description: `Payment for bespoke design engineering / consultancy services (${params.invoiceNumber})`,
          },
          unit_amount: Math.round(params.amount * 100), // convert to cents/pence
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      invoiceId: String(params.invoiceId),
      invoiceNumber: params.invoiceNumber,
    },
  })

  return session
}
