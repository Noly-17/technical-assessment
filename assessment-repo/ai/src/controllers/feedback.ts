import { Request, Response } from 'express';
import { FeedbackRequestSchema } from '../models/feedback';
import {
  analyzeFeedback,
  getCategories,
  getTemplates,
} from '../services/claude';
import logger from '../config/logger';

export async function analyzeFeedbackController(req: Request, res: Response) {
  try {
    const validationResult = FeedbackRequestSchema.safeParse(req.body);
    if (!validationResult.success) {
      logger.warn('Invalid feedback request', {
        errors: validationResult.error.format(),
      });
      return res.status(400).json({
        error: 'Invalid request',
        details: validationResult.error.format(),
      });
    }

    const { text } = validationResult.data;

    const analysis = await analyzeFeedback(text);

    return res.status(200).json(analysis);
  } catch (error) {
    logger.error('Error analyzing feedback', { error });
    return res.status(500).json({
      error: 'Failed to analyze feedback',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export function getCategoriesController(_req: Request, res: Response) {
  try {
    const categories = getCategories();
    return res.status(200).json(categories);
  } catch (error) {
    logger.error('Error getting categories', { error });
    return res.status(500).json({
      error: 'Failed to retrieve categories',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export function getTemplatesController(_req: Request, res: Response) {
  try {
    const templates = getTemplates();
    return res.status(200).json(templates);
  } catch (error) {
    logger.error('Error getting templates', { error });
    return res.status(500).json({
      error: 'Failed to retrieve templates',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
