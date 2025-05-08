export interface TimeSeriesData {
  timestamp: string;
  value: number;
}

export interface StatusUpdate {
  id: string;
  status: 'healthy' | 'warning' | 'error';
  message: string;
  timestamp: string;
}

export interface ThemeConfig {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}
