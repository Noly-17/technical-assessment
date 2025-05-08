module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'Customer Feedback Analysis API',
    version: '1.0.0',
    description: 'API for analyzing customer feedback using Anthropic Claude',
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Development server',
    },
  ],
  apis: ['./src/routes/*.ts'],
};
