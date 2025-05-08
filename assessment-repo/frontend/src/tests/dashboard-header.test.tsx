import { render, screen } from '@testing-library/react';
import { DashboardHeader } from '../components/dashboard-header';
import { ThemeProvider } from '../components/theme-provider';

describe('DashboardHeader', () => {
  it('renders the header with title and theme toggle', () => {
    render(
      <ThemeProvider>
        <DashboardHeader />
      </ThemeProvider>
    );

    expect(screen.getByText('Metrics Dashboard')).toBeInTheDocument();

    expect(
      screen.getByText('Monitor your key metrics in real-time')
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /toggle theme/i })
    ).toBeInTheDocument();
  });
});
