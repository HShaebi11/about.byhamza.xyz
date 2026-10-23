import { choice, noul, score, TypeSafeClient } from '@typesafe-ai/sdk'
import Anthropic from '@anthropic-ai/sdk'

export interface LeadScoringResult {
  intentLabel: 'hot' | 'warm' | 'cold' | 'unscored'
  intentScore: number
  aiSummary: string
  aiDraftPitch: string
}

export async function scoreLead(inquiry: {
  name: string
  email: string
  company?: string | null
  website?: string | null
  service: string
  budget?: string | null
  message: string
}): Promise<LeadScoringResult> {
  const client = new TypeSafeClient()

  const state = {
    lead: {
      name: inquiry.name,
      email: inquiry.email,
      company: inquiry.company || 'Not provided',
      website: inquiry.website || 'Not provided',
      service: inquiry.service,
      budget: inquiry.budget || 'Not provided',
      message: inquiry.message,
    },
  }

  const response = await client.systemOne({
    state,
    questions: {
      // Score the lead's fit with the services offered
      fit: score(
        'How well does this lead fit the services offered (Design Engineering Sprint, Consultancy & Advisory, Interactive/Creative Tech, Design System Architecture, Full Production Build)?',
        [
          'No fit - lead needs services outside of scope',
          'Weak fit - some overlap but not ideal',
          'Good fit - services align well with their needs',
          'Excellent fit - perfect match for services offered',
        ]
      ),

      // Score the buying intent/urgency
      urgency: score('How urgent is this lead based on their message and timeline?', [
        'No urgency or timeline mentioned',
        'Exploratory - researching options',
        'Active need - working on this now',
        'High urgency - deadline or immediate need',
      ]),

      // Score the budget alignment
      budgetSignal: score(
        'Does the budget indicate a serious, qualified lead?',
        [
          'No budget or too low for the work',
          'Low budget - may need negotiation',
          'Reasonable budget - good fit',
          'Strong budget signal - high value prospect',
        ]
      ),

      // Score the seniority/decision-making authority
      authority: score(
        'Based on the company, role context, and message, how likely is this person to make or influence purchase decisions?',
        [
          'Low authority - junior or unclear',
          'Some influence - can champion but not decide',
          'Decision maker - can approve budget',
          'Executive level - budget owner or founder',
        ]
      ),
    },
  })

  // Calculate weighted score (weights can be adjusted)
  const fitScore = response.answers.fit.score
  const urgencyScore = response.answers.urgency.score
  const budgetScore = response.answers.budgetSignal.score
  const authorityScore = response.answers.authority.score

  // Weighted combination: fit (40%), urgency (30%), budget (15%), authority (15%)
  const weightedScore =
    0.4 * fitScore + 0.3 * urgencyScore + 0.15 * budgetScore + 0.15 * authorityScore

  // Convert 0-3 scale to 0-100
  const intentScore = Math.round((weightedScore / 3) * 100)

  // Determine label based on score
  let intentLabel: 'hot' | 'warm' | 'cold' | 'unscored'
  if (intentScore >= 70) {
    intentLabel = 'hot'
  } else if (intentScore >= 40) {
    intentLabel = 'warm'
  } else {
    intentLabel = 'cold'
  }

  // Generate AI summary and pitch using Claude (Anthropic)
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })

  const prompt = `Lead Information:
- Name: ${inquiry.name}
- Email: ${inquiry.email}
- Company: ${inquiry.company || 'Not provided'}
- Website: ${inquiry.website || 'Not provided'}
- Service: ${inquiry.service}
- Budget: ${inquiry.budget || 'Not provided'}
- Message: ${inquiry.message}

Lead Scoring Results:
- Fit Score: ${fitScore.toFixed(2)}/3
- Urgency Score: ${urgencyScore.toFixed(2)}/3
- Budget Signal: ${budgetScore.toFixed(2)}/3
- Authority Score: ${authorityScore.toFixed(2)}/3
- Overall Score: ${intentScore}/100 (${intentLabel})

Please provide:
1. A concise 2-3 sentence executive summary of this lead highlighting: who they are, what they need, their budget range, and key signals that indicate their quality. Be specific and actionable.
2. A warm, professional pitch response tailored to this specific lead. Reference their company, their stated need, and the service they selected. Keep it under 150 words, conversational but professional, and end with a call to action to schedule a call.

Format your response as:
SUMMARY: [your summary]
PITCH: [your pitch]`

  const claudeResponse = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  const responseText = claudeResponse.content[0].type === 'text' ? claudeResponse.content[0].text : ''
  const summaryMatch = responseText.match(/SUMMARY:\s*(.+?)(?=PITCH:|$)/s)
  const pitchMatch = responseText.match(/PITCH:\s*(.+)$/s)

  const aiSummary = summaryMatch ? summaryMatch[1].trim() : 'Summary generation failed'
  const aiDraftPitch = pitchMatch ? pitchMatch[1].trim() : 'Pitch generation failed'

  return {
    intentLabel,
    intentScore,
    aiSummary,
    aiDraftPitch,
  }
}
