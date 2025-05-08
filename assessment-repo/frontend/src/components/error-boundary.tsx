'use client';

import React from 'react';
import { ErrorBoundaryProps } from '../lib/types';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to error tracking service (e.g., Sentry)
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export function ErrorFallback({ error }: { error?: Error }) {
  return (
    <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-destructive">
          Something went wrong
        </h3>
        {error && (
          <p className="text-sm text-destructive/80">{error.message}</p>
        )}
        <button
          onClick={() => window.location.reload()}
          className="mt-2 inline-flex h-8 items-center justify-center rounded-md bg-destructive px-4 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
