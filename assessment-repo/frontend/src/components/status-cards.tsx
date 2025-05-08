'use client';

import type { StatusUpdate } from '../api/mock-data';

interface StatusCardsProps {
  updates: StatusUpdate[];
}

export function StatusCards({ updates }: StatusCardsProps) {
  return (
    <>
      {updates.map((update) => (
        <div
          key={update.id}
          className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
        >
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                update.status === 'healthy'
                  ? 'bg-green-500'
                  : update.status === 'warning'
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
            />
            <p className="text-sm font-medium">{update.message}</p>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {new Date(update.timestamp).toLocaleString()}
          </p>
        </div>
      ))}
    </>
  );
}
