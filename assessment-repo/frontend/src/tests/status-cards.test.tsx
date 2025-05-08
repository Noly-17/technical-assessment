import { render, screen } from '@testing-library/react';
import { StatusCards } from '../components/status-cards';
import type { StatusUpdate } from '../api/mock-data';

const mockUpdates: StatusUpdate[] = [
  {
    id: '1',
    status: 'healthy',
    message: 'All systems operational',
    timestamp: '2024-03-20T10:00:00Z',
  },
  {
    id: '2',
    status: 'warning',
    message: 'High CPU usage detected',
    timestamp: '2024-03-20T09:30:00Z',
  },
  {
    id: '3',
    status: 'error',
    message: 'Service unavailable',
    timestamp: '2024-03-20T09:00:00Z',
  },
];

describe('StatusCards', () => {
  it('renders status cards with correct messages and timestamps', () => {
    render(<StatusCards updates={mockUpdates} />);

    // Check if all messages are rendered
    expect(screen.getByText('All systems operational')).toBeInTheDocument();
    expect(screen.getByText('High CPU usage detected')).toBeInTheDocument();
    expect(screen.getByText('Service unavailable')).toBeInTheDocument();

    // Check if timestamps are rendered
    mockUpdates.forEach((update) => {
      const timestamp = new Date(update.timestamp).toLocaleString();
      expect(screen.getByText(timestamp)).toBeInTheDocument();
    });
  });

  it('renders empty when no updates are provided', () => {
    render(<StatusCards updates={[]} />);
    expect(screen.queryByRole('div')).not.toBeInTheDocument();
  });
});
