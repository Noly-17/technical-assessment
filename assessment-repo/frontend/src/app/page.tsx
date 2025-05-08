import { Suspense } from 'react';
import { StatusCards } from '../components/status-cards';
import { DataGrid } from '../components/data-grid';
import { DashboardHeader } from '../components/dashboard-header';
import { Loading } from '../components/loading';
import { ErrorBoundary, ErrorFallback } from '../components/error-boundary';
import { ThemeProvider } from '../components/theme-provider';
import { fetchMetrics, fetchStatus } from '../api/mock-data';
import { TimeRangeProvider } from '../components/time-range-provider';
import { MetricsChart } from '../components/metrics-chart';

async function MetricsChartWrapper() {
  const initialData = await fetchMetrics('day');

  return (
    <TimeRangeProvider initialRange="day" initialData={initialData}>
      <MetricsChart />
    </TimeRangeProvider>
  );
}

async function StatusCardsWrapper() {
  const statusData = await fetchStatus();
  return <StatusCards updates={statusData} />;
}

async function DataGridWrapper() {
  const gridData = await fetchMetrics('day');
  return <DataGrid data={gridData} />;
}

export default function Dashboard() {
  return (
    <ThemeProvider>
      <main className="min-h-screen p-4 md:p-6 lg:p-8 bg-background">
        <ErrorBoundary fallback={<ErrorFallback />}>
          <DashboardHeader />
          <div className="grid gap-6 mt-6">
            <div className="grid gap-4 md:grid-cols-3">
              <ErrorBoundary fallback={<ErrorFallback />}>
                <Suspense fallback={<Loading type="card" />}>
                  <StatusCardsWrapper />
                </Suspense>
              </ErrorBoundary>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <ErrorBoundary fallback={<ErrorFallback />}>
                  <Suspense fallback={<Loading type="chart" />}>
                    <MetricsChartWrapper />
                  </Suspense>
                </ErrorBoundary>
              </div>
              <div className="md:col-span-2">
                <ErrorBoundary fallback={<ErrorFallback />}>
                  <Suspense fallback={<Loading type="grid" />}>
                    <DataGridWrapper />
                  </Suspense>
                </ErrorBoundary>
              </div>
            </div>
          </div>
        </ErrorBoundary>
      </main>
    </ThemeProvider>
  );
}
