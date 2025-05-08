# Metrics Dashboard

A modern, responsive dashboard built with Next.js 14 that displays real-time and historical metrics data.

## Features

- Real-time and historical data visualization
- Responsive layout (mobile-first)
- Dark/light mode support
- Interactive charts and data tables
- Search and filter functionality
- Loading and error states
- Automated tests

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts
- React Testing Library
- Jest

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run lint` - Check code quality

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── api/             # Mock API endpoints
│   └── __tests__/       # Test files
├── public/              # Static assets
└── tailwind.config.js   # Tailwind configuration
```

## Component Architecture

- `DashboardHeader` - Main header with theme toggle
- `MetricsChart` - Time series data visualization
- `StatusCards` - System status indicators
- `DataGrid` - Tabular data display

## Performance Optimizations

- Server and Client Components separation
- Suspense boundaries for loading states
- Memoized components where beneficial
- Optimized bundle size
- Responsive images and lazy loading

## Testing Strategy

- Unit tests for components
- Integration tests for data flow
- Accessibility tests
- Mock API calls
- Test coverage tracking

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
