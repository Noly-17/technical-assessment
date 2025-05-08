# Frontend Specialist Assessment

## Objective

Create a modern, responsive dashboard using Next.js 14 that demonstrates your frontend expertise.

## Project Overview

You'll be building a metrics dashboard that:

- Displays real-time and historical data
- Implements responsive layouts
- Handles loading and error states
- Uses modern React patterns

## Tasks

### 1. Dashboard Implementation (40 points)

```tsx
// Example component structure provided
import { Suspense } from 'react';
import { MetricsChart, DataGrid, StatusCards } from './components';

export default function Dashboard() {
  return (
    <div className="dashboard-layout">
      <Suspense fallback={<Loading />}>
        {/* Implement your dashboard here */}
      </Suspense>
    </div>
  );
}
```

Requirements:

- Use Next.js 14 App Router
- Implement Server and Client Components appropriately
- Create reusable components
- Add proper loading states
- Handle errors gracefully
- Make it responsive (mobile-first)

### 2. Data Integration (30 points)

We provide a mock API in `api/mock-data.ts`:

```typescript
// Example usage
const data = await fetchMetrics(); // Returns mock time-series data
const status = await fetchStatus(); // Returns mock status updates
```

Requirements:

- Implement data fetching using provided mock API
- Add proper TypeScript types
- Handle loading states
- Implement error boundaries
- Add retry logic
- Cache responses appropriately

### 3. Performance & Testing (30 points)

Requirements:

- Add component tests using React Testing Library
- Implement performance monitoring
- Optimize bundle size
- Add error tracking
- Document performance decisions

## Getting Started

1. Setup project:

```bash
# Everything is local - no external services needed
npm install
npm run dev
```

2. Available Scripts:

```bash
npm run dev        # Start development server
npm run test      # Run tests
npm run lint      # Check code quality
npm run build     # Production build
```

3. Project Structure:

```
frontend/
├── app/                # Next.js 14 app directory
├── components/         # Reusable components
├── lib/               # Utilities and helpers
├── api/               # Mock API endpoints
└── tests/             # Test files
```

## Provided Resources

- Mock API with TypeScript types
- Basic component templates
- Test setup and examples
- ESLint configuration
- Example data structures

## Requirements

### Technical

- Next.js 14
- TypeScript
- Tailwind CSS
- React Testing Library
- ESLint + Prettier

### Features

- Metrics visualization
- Data tables
- Status indicators
- Search/filter functionality
- Responsive design
- Dark/light mode

### Testing

- Component tests
- Integration tests
- Performance tests
- Accessibility tests

## Evaluation Criteria

### Code Quality (30%)

- Clean, maintainable code
- TypeScript usage
- Error handling
- Code organization

### UI/UX (30%)

- Responsive design
- Loading states
- Error states
- Visual consistency

### Performance (20%)

- Load time optimization
- Bundle size
- Render optimization
- Caching strategy

### Testing (20%)

- Test coverage
- Test quality
- Edge cases
- Accessibility testing

## Tips

- Start with component structure
- Use provided mock data
- Focus on core functionality first
- Document key decisions
- Consider edge cases
- Test thoroughly

## Submission Checklist

- [ ] All features implemented
- [ ] Tests passing
- [ ] Performance optimized
- [ ] Documentation complete
- [ ] Code linting clean
- [ ] Responsive design working
- [ ] Dark/light mode working

## Notes

- All data is mocked locally - no external services needed
- No authentication required
- No backend integration needed
- Focus on frontend implementation
- Document any assumptions made
