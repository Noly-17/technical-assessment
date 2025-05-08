import request from 'supertest';
import app from '../app';
import * as claudeService from '../services/claude';

jest.mock('../services/claude', () => ({
  analyzeFeedback: jest.fn(),
  getCategories: jest.fn(),
  getTemplates: jest.fn(),
}));

describe('API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/analyze', () => {
    it('should analyze feedback and return results', async () => {
      const mockAnalysisResult = {
        category: 'feature_request',
        sentiment: 'positive',
        priority: 'medium',
        actionItems: ['Add feature'],
        summary: 'User wants a new feature',
        responseTemplate: 'Thank you for your suggestion',
      };

      (claudeService.analyzeFeedback as jest.Mock).mockResolvedValue(
        mockAnalysisResult
      );

      const response = await request(app)
        .post('/api/analyze')
        .send({ text: 'This is sample feedback' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockAnalysisResult);
      expect(claudeService.analyzeFeedback).toHaveBeenCalledWith(
        'This is sample feedback'
      );
    });

    it('should return 400 if request body is invalid', async () => {
      const response = await request(app)
        .post('/api/analyze')
        .send({})
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid request');
    });
  });

  describe('GET /api/categories', () => {
    it('should return categories', async () => {
      const mockCategories = {
        categories: [
          {
            id: 'bug_report',
            name: 'Bug Report',
            description: 'Report of a software issue',
          },
        ],
      };

      (claudeService.getCategories as jest.Mock).mockReturnValue(
        mockCategories
      );

      const response = await request(app)
        .get('/api/categories')
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCategories);
    });
  });

  describe('GET /api/templates', () => {
    it('should return templates', async () => {
      const mockTemplates = {
        templates: [
          {
            category: 'bug_report',
            template: 'Thank you for reporting this issue',
          },
        ],
      };

      (claudeService.getTemplates as jest.Mock).mockReturnValue(mockTemplates);

      const response = await request(app)
        .get('/api/templates')
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTemplates);
    });
  });

  describe('Error handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .set('Accept', 'application/json');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Not Found');
    });
  });
});
