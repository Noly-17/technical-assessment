import { render, screen } from '@testing-library/react';
import { Loading } from '../components/loading';

describe('Loading', () => {
  it('renders default loading spinner with text', () => {
    render(<Loading />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveClass('animate-spin');
  });

  it('renders card loading skeleton', () => {
    render(<Loading type="card" />);
    const skeletons = screen
      .getAllByTestId('loading-skeleton')
      .filter((element) => element.classList.contains('animate-pulse'));
    expect(skeletons).toHaveLength(2);
  });

  it('renders chart loading skeleton', () => {
    render(<Loading type="chart" />);
    const skeletons = screen
      .getAllByTestId('loading-skeleton')
      .filter((element) => element.classList.contains('animate-pulse'));
    expect(skeletons).toHaveLength(2);
    const chartPlaceholder = skeletons.find((element) =>
      element.classList.contains('h-[200px]')
    );
    expect(chartPlaceholder).toBeInTheDocument();
  });

  it('renders grid loading skeleton with 5 rows', () => {
    render(<Loading type="grid" />);
    const skeletons = screen
      .getAllByTestId('loading-skeleton')
      .filter((element) => element.classList.contains('animate-pulse'));
    expect(skeletons.length).toBeGreaterThanOrEqual(6);
  });
});
