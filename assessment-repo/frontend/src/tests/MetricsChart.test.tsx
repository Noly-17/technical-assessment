import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MetricsChart } from '../components/metrics-chart';
import { TimeRangeProvider } from '../components/time-range-provider';
import { fetchMetrics } from '../api/mock-data';

jest.mock('../api/mock-data', () => ({
  fetchMetrics: jest.fn(),
}));

const mockData = [
  { timestamp: '2024-03-20T12:00:00Z', value: 75 },
  { timestamp: '2024-03-20T13:00:00Z', value: 80 },
];

const mockNewData = [
  { timestamp: '2024-03-20T14:00:00Z', value: 85 },
  { timestamp: '2024-03-20T15:00:00Z', value: 90 },
];

describe('MetricsChart', () => {
  beforeEach(() => {
    (fetchMetrics as jest.Mock).mockClear();
  });

  it('renders chart with initial data', () => {
    render(
      <TimeRangeProvider initialRange="hour" initialData={mockData}>
        <MetricsChart />
      </TimeRangeProvider>
    );

    expect(screen.getByText('Metrics Over Time')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Hour' })).toHaveClass(
      'bg-primary'
    );
    expect(screen.getByRole('button', { name: 'Day' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Week' })).toBeInTheDocument();
  });

  it('changes time range when buttons are clicked', async () => {
    const user = userEvent.setup();
    (fetchMetrics as jest.Mock).mockResolvedValueOnce(mockNewData);

    render(
      <TimeRangeProvider initialRange="hour" initialData={mockData}>
        <MetricsChart />
      </TimeRangeProvider>
    );

    const dayButton = screen.getByRole('button', { name: 'Day' });
    await user.click(dayButton);

    expect(fetchMetrics).toHaveBeenCalledWith('day');
    await waitFor(() => {
      expect(dayButton).toHaveClass('bg-primary');
      expect(screen.getByRole('button', { name: 'Hour' })).not.toHaveClass(
        'bg-primary'
      );
    });
  });

  it('handles time range change error gracefully', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    (fetchMetrics as jest.Mock).mockRejectedValueOnce(
      new Error('Failed to fetch')
    );

    render(
      <TimeRangeProvider initialRange="hour" initialData={mockData}>
        <MetricsChart />
      </TimeRangeProvider>
    );

    const weekButton = screen.getByRole('button', { name: 'Week' });
    await user.click(weekButton);

    expect(fetchMetrics).toHaveBeenCalledWith('week');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to fetch metrics:',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });
});
