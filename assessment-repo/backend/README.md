# Backend Specialist Assessment

## Objective

Create a RESTful API service using Node.js/TypeScript that demonstrates your backend expertise.

## Project Overview

You'll be building an API for a task management system that:

- Handles CRUD operations
- Implements proper error handling
- Uses PostgreSQL (provided via Docker)
- Includes comprehensive tests

## Tasks

### 1. API Implementation (40 points)

Example API structure:

```typescript
// Example endpoint structure
import { Router } from 'express';
import { validateTask } from '../middleware/validation';

const router = Router();

router.post('/tasks', validateTask, async (req, res) => {
  // Implementation
});

export default router;
```

Requirements:

- Create RESTful endpoints for:
  - Task management
  - User management
  - Task assignments
- Implement proper validation
- Add authentication middleware
- Handle errors appropriately
- Document using OpenAPI/Swagger

### 2. Database Integration (30 points)

We provide Docker Compose for PostgreSQL:

```yaml
# docker-compose.yml provided
services:
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: taskdb
      POSTGRES_USER: developer
      POSTGRES_PASSWORD: localdev
    ports:
      - '5432:5432'
```

Requirements:

- Implement database schema
- Add migrations
- Create data models
- Implement repositories
- Add database transactions
- Handle connection errors

### 3. Testing & Documentation (30 points)

Requirements:

- Unit tests
- Integration tests
- API documentation
- Performance testing
- Security testing

## Getting Started

1. Setup project:

```bash
# Start database
docker-compose up -d

# Install dependencies
npm install

# Run migrations
npm run migrate

# Start development server
npm run dev
```

2. Available Scripts:

```bash
npm run dev        # Start development server
npm run test      # Run tests
npm run migrate   # Run database migrations
npm run docs      # Generate API documentation
```

3. Project Structure:

```
backend/
├── src/
│   ├── controllers/    # Route handlers
│   ├── models/        # Data models
│   ├── middleware/    # Express middleware
│   ├── services/      # Business logic
│   └── utils/         # Helper functions
├── tests/            # Test files
├── migrations/       # Database migrations
└── docs/            # Documentation
```

## Provided Resources

- Docker Compose file
- Database schema template
- Test examples
- API documentation template
- Postman collection

## Requirements

### Technical

- Node.js
- TypeScript
- PostgreSQL
- Express/Fastify
- Jest
- OpenAPI/Swagger

### Features

- CRUD operations
- Data validation
- Error handling
- Authentication
- Rate limiting
- Request logging

### Testing

- Unit tests
- Integration tests
- Load tests
- Security tests

## Evaluation Criteria

### Code Quality (30%)

- Clean, maintainable code
- TypeScript usage
- Error handling
- Code organization

### API Design (30%)

- RESTful principles
- Validation
- Security
- Documentation

### Database (20%)

- Schema design
- Query optimization
- Transaction handling
- Error handling

### Testing (20%)

- Test coverage
- Test quality
- Edge cases
- Performance testing

## Tips

- Start with database schema
- Use provided Docker setup
- Focus on error handling
- Document API thoroughly
- Consider edge cases
- Test all endpoints

## Submission Checklist

- [ ] All endpoints implemented
- [ ] Tests passing
- [ ] Documentation complete
- [ ] Database migrations working
- [ ] Error handling implemented
- [ ] API security measures in place
- [ ] Performance tested

## Notes

- Database runs locally in Docker
- No cloud services needed
- Focus on API implementation
- Document any assumptions
- Use provided test data
