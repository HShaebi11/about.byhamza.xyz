import type { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

// Lazy-loaded so posthog-node stays out of the cold-start module graph
export async function getPostHogClient(): Promise<PostHog | null> {
  if (!process.env.POSTHOG_PERSONAL_API_KEY || !process.env.POSTHOG_PROJECT_ID) {
    console.warn('PostHog server client not configured: missing POSTHOG_PERSONAL_API_KEY or POSTHOG_PROJECT_ID');
    return null;
  }

  if (!posthogClient) {
    const { PostHog } = await import('posthog-node');
    posthogClient = new PostHog(process.env.POSTHOG_PERSONAL_API_KEY, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
    });
  }

  return posthogClient;
}

/**
 * Track inquiry submission from server-side
 * This should be called when an inquiry is submitted via the Payload API
 */
export async function trackInquirySubmission(inquiryData: {
  name: string;
  email: string;
  company?: string;
  service?: string;
  budget?: string;
  posthogDistinctId?: string;
}) {
  const client = await getPostHogClient();
  if (!client) return;

  try {
    await client.capture({
      distinctId: inquiryData.posthogDistinctId || inquiryData.email,
      event: 'inquiry_submitted',
      properties: {
        name: inquiryData.name,
        email: inquiryData.email,
        company: inquiryData.company,
        service: inquiryData.service,
        budget: inquiryData.budget,
        $set: {
          email: inquiryData.email,
          name: inquiryData.name,
          company: inquiryData.company,
        },
      },
    });
  } catch (error) {
    console.error('Failed to track inquiry submission:', error);
  }
}

/**
 * Track an inquiry-to-client conversion from server-side
 * Called by the convert-inquiry-to-client API route
 */
export async function trackInquiryConversion(
  inquiryId: string,
  clientId: string,
  inquiryData: {
    name?: string
    email?: string
    company?: string | null
    service?: string | null
    budget?: string | null
    intentLabel?: string | null
    intentScore?: number | null
  },
) {
  const client = await getPostHogClient();
  if (!client) return;

  try {
    await client.capture({
      distinctId: inquiryData.email || inquiryId,
      event: 'inquiry_converted_to_client',
      properties: {
        inquiry_id: inquiryId,
        client_id: clientId,
        name: inquiryData.name,
        email: inquiryData.email,
        company: inquiryData.company,
        service: inquiryData.service,
        budget: inquiryData.budget,
        intent_label: inquiryData.intentLabel,
        intent_score: inquiryData.intentScore,
      },
    });
  } catch (error) {
    console.error('Failed to track inquiry conversion:', error);
  }
}
