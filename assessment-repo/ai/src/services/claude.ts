import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config/environment';
import logger from '../config/logger';
import {
  FeedbackAnalysis,
  FeedbackCategory,
  PriorityLevel,
  Sentiment,
} from '../models/feedback';

// Create Anthropic client
const anthropic = new Anthropic({
  apiKey: config.anthropic.apiKey,
});

/**
 * Analyze customer feedback using Claude
 */
export async function analyzeFeedback(
  feedbackText: string
): Promise<FeedbackAnalysis> {
  try {
    logger.info('Analyzing feedback with Claude API');

    const prompt = buildAnalysisPrompt(feedbackText);

    // Use completions for older SDK versions or messages for newer versions
    // Check if messages is available, otherwise fall back to completions
    const response = await anthropic.completions.create({
      model: config.anthropic.model,
      max_tokens_to_sample: 1000,
      prompt: `\n\nHuman: ${prompt}\n\nAssistant:`,
      temperature: 0,
    });

    // Parse the JSON response
    const content = response.completion;

    try {
      // Extract JSON from the response
      const jsonMatch =
        content.match(/```json\n([\s\S]*?)\n```/) || content.match(/{[\s\S]*}/);

      if (!jsonMatch) {
        logger.error('Failed to extract JSON from Claude response', {
          content,
        });
        throw new Error('Failed to extract JSON from Claude response');
      }

      const jsonString = jsonMatch[1] || jsonMatch[0];
      const analysis = JSON.parse(jsonString) as FeedbackAnalysis;

      logger.info('Successfully analyzed feedback', {
        category: analysis.category,
        sentiment: analysis.sentiment,
        priority: analysis.priority,
      });

      return analysis;
    } catch (parseError) {
      logger.error('Failed to parse Claude JSON response', {
        error: parseError,
        content,
      });
      throw new Error('Failed to parse Claude response');
    }
  } catch (error) {
    logger.error('Error calling Claude API', { error });
    throw new Error('Failed to analyze feedback with Claude');
  }
}

/**
 * Build the prompt for feedback analysis
 */
function buildAnalysisPrompt(feedbackText: string): string {
  return `
Analyze the following customer feedback text. Identify the category, sentiment, priority level, and extract action items.
Then generate an appropriate response template.

Customer Feedback:
"""
${feedbackText}
"""

Provide your analysis as JSON with the following structure:
\`\`\`json
{
  "category": "bug_report" | "feature_request" | "support_inquiry" | "general_feedback",
  "sentiment": "positive" | "neutral" | "negative",
  "priority": "low" | "medium" | "high" | "critical",
  "actionItems": ["specific action item 1", "specific action item 2", ...],
  "summary": "A one-sentence summary of the feedback",
  "responseTemplate": "An appropriate customer service response template"
}
\`\`\`

Rules for Analysis:
1. Category should be one of: bug_report, feature_request, support_inquiry, general_feedback
2. Sentiment should be one of: positive, neutral, negative
3. Priority should be one of: low, medium, high, critical
4. Action items should be specific, actionable tasks based on the feedback
5. The response template should be professional, empathetic, and address the customer's concerns

Output ONLY the JSON response, nothing else before or after.
`;
}

/**
 * Get predefined categories for feedback
 */
export function getCategories() {
  return {
    categories: [
      {
        id: FeedbackCategory.BUG_REPORT,
        name: 'Bug Report',
        description: 'Report of a software issue or error',
      },
      {
        id: FeedbackCategory.FEATURE_REQUEST,
        name: 'Feature Request',
        description: 'Suggestion for a new feature or enhancement',
      },
      {
        id: FeedbackCategory.SUPPORT_INQUIRY,
        name: 'Support Inquiry',
        description: 'Question about how to use the product',
      },
      {
        id: FeedbackCategory.GENERAL_FEEDBACK,
        name: 'General Feedback',
        description: 'General comments or suggestions',
      },
    ],
  };
}

/**
 * Get response templates for each category
 */
export function getTemplates() {
  return {
    templates: [
      {
        category: FeedbackCategory.BUG_REPORT,
        template:
          "Thank you for reporting this issue. We've logged it in our system and our development team is investigating. We'll update you once we have more information.",
      },
      {
        category: FeedbackCategory.FEATURE_REQUEST,
        template:
          'Thank you for your feature suggestion! We appreciate your input and have added it to our product roadmap for consideration in future updates.',
      },
      {
        category: FeedbackCategory.SUPPORT_INQUIRY,
        template:
          "Thank you for reaching out. We're here to help. Here's some information that might assist you: {{information}}. Please let us know if you have any other questions.",
      },
      {
        category: FeedbackCategory.GENERAL_FEEDBACK,
        template:
          'Thank you for your feedback. We value your input and are constantly working to improve our product based on customer suggestions.',
      },
    ],
  };
}
