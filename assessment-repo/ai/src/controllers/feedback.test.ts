import { Request, Response } from 'express';
import {
  analyzeFeedbackController,
  getCategoriesController,
  getTemplatesController,
} from './feedback';
import * as claudeService from '../services/claude';

jest.mock('../services/claude', () => ({
  analyzeFeedback: jest.fn(),
  getCategories: jest.fn(),
  getTemplates: jest.fn(),
}));

jest.mock('../config/logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Feedback Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  const mockStatus = jest.fn();
  const mockJson = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: mockStatus.mockReturnThis(),
      json: mockJson,
    };
    jest.clearAllMocks();
  });

  describe('analyzeFeedbackController', () => {
    it('should return 400 if request body is invalid', async () => {
      mockRequest.body = {};

      await analyzeFeedbackController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Invalid request',
        })
      );
    });

    it('should analyze feedback and return results', async () => {
      mockRequest.body = { text: 'This is sample feedback' };

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

      await analyzeFeedbackController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(claudeService.analyzeFeedback).toHaveBeenCalledWith(
        'This is sample feedback'
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockAnalysisResult);
    });

    it('should return 500 if analysis fails', async () => {
      mockRequest.body = { text: 'This is sample feedback' };

      const error = new Error('Analysis failed');
      (claudeService.analyzeFeedback as jest.Mock).mockRejectedValue(error);

      await analyzeFeedbackController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Failed to analyze feedback',
        })
      );
    });
  });

  describe('getCategoriesController', () => {
    it('should return categories', () => {
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

      getCategoriesController(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockCategories);
    });
  });

  describe('getTemplatesController', () => {
    it('should return templates', () => {
      const mockTemplates = {
        templates: [
          {
            category: 'bug_report',
            template: 'Thank you for reporting this issue',
          },
        ],
      };

      (claudeService.getTemplates as jest.Mock).mockReturnValue(mockTemplates);

      getTemplatesController(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockTemplates);
    });
  });
});
