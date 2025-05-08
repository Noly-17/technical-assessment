'use client';

import { ThemeToggle } from './theme-toggle';

export function DashboardHeader() {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Metrics Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your key metrics in real-time
        </p>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </header>
  );
}
