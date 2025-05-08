import { render, screen, renderHook, act } from '@testing-library/react';
import {
  TimeRangeProvider,
  useTimeRange,
} from '../components/time-range-provider';
import { fetchMetrics } from '../api/mock-data';

jest.mock('../api/mock-data', () => ({
  fetchMetrics: jest.fn(),
}));

const mockData = [
  { timestamp: '2024-03-20T10:00:00Z', value: 100 },
  { timestamp: '2024-03-20T11:00:00Z', value: 120 },
];

const mockNewData = [
  { timestamp: '2024-03-20T12:00:00Z', value: 130 },
  { timestamp: '2024-03-20T13:00:00Z', value: 140 },
];

describe('TimeRangeProvider', () => {
  beforeEach(() => {
    (fetchMetrics as jest.Mock).mockClear();
  });

  it('provides initial time range and data to children', () => {
    const TestComponent = () => {
      const { timeRange, data } = useTimeRange();
      return (
        <div>
          <span>Time Range: {timeRange}</span>
          <span>Data Length: {data.length}</span>
        </div>
      );
    };

    render(
      <TimeRangeProvider initialRange="hour" initialData={mockData}>
        <TestComponent />
      </TimeRangeProvider>
    );

    expect(screen.getByText('Time Range: hour')).toBeInTheDocument();
    expect(screen.getByText('Data Length: 2')).toBeInTheDocument();
  });

  it('updates time range and fetches new data', async () => {
    (fetchMetrics as jest.Mock).mockResolvedValueOnce(mockNewData);

    const { result } = renderHook(() => useTimeRange(), {
      wrapper: ({ children }) => (
        <TimeRangeProvider initialRange="hour" initialData={mockData}>
          {children}
        </TimeRangeProvider>
      ),
    });

    expect(result.current.timeRange).toBe('hour');
    expect(result.current.data).toEqual(mockData);

    await act(async () => {
      await result.current.setTimeRange('day');
    });

    expect(fetchMetrics).toHaveBeenCalledWith('day');
    expect(result.current.timeRange).toBe('day');
    expect(result.current.data).toEqual(mockNewData);
  });

  it('handles fetch error gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    (fetchMetrics as jest.Mock).mockRejectedValueOnce(
      new Error('Fetch failed')
    );

    const { result } = renderHook(() => useTimeRange(), {
      wrapper: ({ children }) => (
        <TimeRangeProvider initialRange="hour" initialData={mockData}>
          {children}
        </TimeRangeProvider>
      ),
    });

    await act(async () => {
      await result.current.setTimeRange('week');
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to fetch metrics:',
      expect.any(Error)
    );
    expect(result.current.timeRange).toBe('week');
    expect(result.current.data).toEqual(mockData); // Data should remain unchanged

    consoleErrorSpy.mockRestore();
  });

  it('throws error when useTimeRange is used outside provider', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      renderHook(() => useTimeRange());
    }).toThrow('useTimeRange must be used within a TimeRangeProvider');

    consoleErrorSpy.mockRestore();
  });
});
