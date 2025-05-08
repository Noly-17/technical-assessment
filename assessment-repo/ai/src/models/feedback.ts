import { z } from 'zod';

// Feedback category enum
export enum FeedbackCategory {
  BUG_REPORT = 'bug_report',
  FEATURE_REQUEST = 'feature_request',
  SUPPORT_INQUIRY = 'support_inquiry',
  GENERAL_FEEDBACK = 'general_feedback',
}

// Priority level enum
export enum PriorityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Sentiment enum
export enum Sentiment {
  POSITIVE = 'positive',
  NEUTRAL = 'neutral',
  NEGATIVE = 'negative',
}

// Feedback request schema
export const FeedbackRequestSchema = z.object({
  text: z.string().min(1).max(10000),
});

export type FeedbackRequest = z.infer<typeof FeedbackRequestSchema>;

// Feedback analysis result schema
export const FeedbackAnalysisSchema = z.object({
  category: z.nativeEnum(FeedbackCategory),
  sentiment: z.nativeEnum(Sentiment),
  priority: z.nativeEnum(PriorityLevel),
  actionItems: z.array(z.string()),
  summary: z.string(),
  responseTemplate: z.string(),
});

export type FeedbackAnalysis = z.infer<typeof FeedbackAnalysisSchema>;

// Categories response schema for the /categories endpoint
export const CategoriesResponseSchema = z.object({
  categories: z.array(
    z.object({
      id: z.nativeEnum(FeedbackCategory),
      name: z.string(),
      description: z.string(),
    })
  ),
});

export type CategoriesResponse = z.infer<typeof CategoriesResponseSchema>;

// Templates response schema for the /templates endpoint
export const TemplatesResponseSchema = z.object({
  templates: z.array(
    z.object({
      category: z.nativeEnum(FeedbackCategory),
      template: z.string(),
    })
  ),
});

export type TemplatesResponse = z.infer<typeof TemplatesResponseSchema>; 