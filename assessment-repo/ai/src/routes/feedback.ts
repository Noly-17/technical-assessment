import { Router } from 'express';
import { 
  analyzeFeedbackController, 
  getCategoriesController, 
  getTemplatesController 
} from '../controllers/feedback';
import { apiRateLimiter } from '../middleware/rate-limiter';

const router = Router();

/**
 * @swagger
 * /analyze:
 *   post:
 *     summary: Analyze customer feedback
 *     description: Submit customer feedback text for analysis using Claude AI
 *     tags:
 *       - Feedback
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 description: The customer feedback text
 *     responses:
 *       200:
 *         description: Feedback analyzed successfully
 *       400:
 *         description: Invalid request
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Server error
 */
router.post('/analyze', apiRateLimiter, analyzeFeedbackController);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get feedback categories
 *     description: Retrieve available feedback categories
 *     tags:
 *       - Feedback
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/categories', getCategoriesController);

/**
 * @swagger
 * /templates:
 *   get:
 *     summary: Get response templates
 *     description: Retrieve available response templates for each category
 *     tags:
 *       - Feedback
 *     responses:
 *       200:
 *         description: Templates retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/templates', getTemplatesController);

export default router; 