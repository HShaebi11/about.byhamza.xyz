import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { stripe } from '@/lib/stripe'
import { trackInquiryConversion } from '@/lib/posthog'

export async function POST(req: NextRequest) {
  try {
    const { inquiryId } = (await req.json()) as { inquiryId?: string | number }

    if (!inquiryId) {
      return NextResponse.json({ error: 'inquiryId is required' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    // Fetch the inquiry
    const inquiry = await payload.findByID({
      collection: 'inquiries',
      id: inquiryId,
    })

    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 })
    }

    // Check if a client with this email already exists
    const existingClients = await payload.find({
      collection: 'clients',
      where: {
        email: {
          equals: inquiry.email,
        },
      },
    })

    if (existingClients.totalDocs > 0) {
      return NextResponse.json(
        { error: 'Client with this email already exists', clientId: existingClients.docs[0].id },
        { status: 409 }
      )
    }

    // Create Stripe customer
    let stripeCustomerId = ''
    try {
      if (process.env.STRIPE_SECRET_KEY) {
        const customer = await stripe.customers.create({
          email: inquiry.email,
          name: inquiry.name,
          metadata: {
            inquiryId: String(inquiryId),
            company: inquiry.company || '',
            service: inquiry.service || '',
          },
        })
        stripeCustomerId = customer.id
      }
    } catch (stripeError) {
      console.error('Error creating Stripe customer:', stripeError)
      // Continue without Stripe customer - it's not critical
    }

    // Create client from inquiry data with onboarding checklist
    const client = await payload.create({
      collection: 'clients',
      data: {
        company: inquiry.company || inquiry.name,
        name: inquiry.name,
        email: inquiry.email,
        website: inquiry.website || '',
        status: 'active_client',
        currency: 'GBP',
        stripeCustomerId: stripeCustomerId || undefined,
        notes: `Converted from inquiry #${inquiryId}. Original service interest: ${inquiry.service}. Budget: ${inquiry.budget}.`,
        onboardingChecklist: [
          { task: 'Send welcome email and project kickoff materials', completed: false },
          { task: 'Schedule initial discovery call', completed: false },
          { task: 'Set up project workspace and communication channels', completed: false },
          { task: 'Send initial proposal/contract for signature', completed: false },
          { task: 'Collect payment method and billing information', completed: false },
          { task: 'Set up Stripe customer and subscription (if applicable)', completed: false },
          { task: 'Create project timeline and milestones', completed: false },
          { task: 'Provide access to client portal/project tracker', completed: false },
        ],
      },
    })

    // Update inquiry status to 'won'
    await payload.update({
      collection: 'inquiries',
      id: inquiryId,
      data: {
        status: 'won',
      },
    })

    // Track conversion in PostHog
    await trackInquiryConversion(
      String(inquiryId),
      String(client.id),
      {
        name: inquiry.name,
        email: inquiry.email,
        company: inquiry.company,
        service: inquiry.service,
        budget: inquiry.budget,
        intentLabel: inquiry.intentLabel,
        intentScore: inquiry.intentScore,
      }
    )

    console.log(`[Conversion] Inquiry ${inquiryId} converted to client ${client.id}`)

    return NextResponse.json({
      success: true,
      clientId: client.id,
      stripeCustomerId,
      message: 'Inquiry successfully converted to client',
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[Convert Inquiry to Client Error]', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
