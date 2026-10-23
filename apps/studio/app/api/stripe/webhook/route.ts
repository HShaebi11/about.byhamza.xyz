import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  let event: Stripe.Event

  try {
    if (webhookSecret && sig) {
      const stripe = await getStripe()
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } else {
      // In development fallback if secret is not yet set
      event = JSON.parse(body) as Stripe.Event
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`Stripe Webhook signature verification failed: ${message}`)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  const payload = await getPayload({ config: configPromise })

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const invoiceId = session.metadata?.invoiceId || session.client_reference_id

        if (invoiceId) {
          const invoice = await payload.findByID({
            collection: 'invoices',
            id: invoiceId,
          })

          if (invoice) {
            await payload.update({
              collection: 'invoices',
              id: invoiceId,
              data: {
                status: 'paid',
                stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : undefined,
              },
            })

            // Update associated client lifetime revenue
            const clientId = typeof invoice.client === 'object' ? invoice.client.id : invoice.client
            if (clientId) {
              const client = await payload.findByID({
                collection: 'clients',
                id: clientId,
              })

              if (client) {
                const currentRev = client.lifetimeRevenue || 0
                await payload.update({
                  collection: 'clients',
                  id: clientId,
                  data: {
                    lifetimeRevenue: currentRev + (invoice.totalAmount || 0),
                    status: 'active_client',
                  },
                })
              }
            }

            console.log(`[Stripe Webhook] Invoice ${invoice.invoiceNumber} marked as PAID.`)
          }
        }
        break
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[Stripe Webhook Error]', error)
    return NextResponse.json({ error: message }, { status: 500, headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    }})
  }
}
