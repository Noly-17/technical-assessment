import { render, screen } from '@testing-library/react';
import { DataGrid } from '../components/data-grid';
import type { TimeSeriesData } from '../api/mock-data';

const mockData: TimeSeriesData[] = [
  {
    timestamp: '2024-03-20T10:00:00Z',
    value: 100,
  },
  {
    timestamp: '2024-03-20T11:00:00Z',
    value: 120,
  },
  {
    timestamp: '2024-03-20T12:00:00Z',
    value: 90,
  },
];

describe('DataGrid', () => {
  it('renders the data grid with correct headers', () => {
    render(<DataGrid data={mockData} />);

    expect(screen.getByText('Recent Data Points')).toBeInTheDocument();
    expect(screen.getByText('Timestamp')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
    expect(screen.getByText('Change')).toBeInTheDocument();
  });

  it('displays correct values and calculates changes', () => {
    render(<DataGrid data={mockData} />);

    expect(screen.getByText('100.00')).toBeInTheDocument();
    expect(screen.getByText('120.00')).toBeInTheDocument();
    expect(screen.getByText('90.00')).toBeInTheDocument();

    expect(screen.getByText('0.00%')).toBeInTheDocument();
    expect(screen.getByText('20.00%')).toBeInTheDocument();
    expect(screen.getByText('25.00%')).toBeInTheDocument();
  });

  it('renders timestamps in locale string format', () => {
    render(<DataGrid data={mockData} />);

    mockData.forEach((item) => {
      const timestamp = new Date(item.timestamp).toLocaleString();
      expect(screen.getByText(timestamp)).toBeInTheDocument();
    });
  });

  it('renders empty grid when no data is provided', () => {
    render(<DataGrid data={[]} />);
    expect(screen.getByText('Recent Data Points')).toBeInTheDocument();
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
  });
});
