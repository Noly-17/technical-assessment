'use client';

import type { TimeSeriesData } from '../api/mock-data';

interface DataGridProps {
  data: TimeSeriesData[];
}

export function DataGrid({ data }: DataGridProps) {
  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4">
        <h2 className="text-xl font-semibold">Recent Data Points</h2>
      </div>
      <div className="border-t">
        <div className="grid grid-cols-3 gap-4 p-4 text-sm font-medium text-muted-foreground">
          <div>Timestamp</div>
          <div>Value</div>
          <div>Change</div>
        </div>
        <div className="divide-y">
          {data.map((item, index) => {
            const prevValue = index > 0 ? data[index - 1].value : item.value;
            const change = ((item.value - prevValue) / prevValue) * 100;

            return (
              <div
                key={item.timestamp}
                className="grid grid-cols-3 gap-4 p-4 text-sm"
              >
                <div>{new Date(item.timestamp).toLocaleString()}</div>
                <div>{item.value.toFixed(2)}</div>
                <div
                  className={change >= 0 ? 'text-green-500' : 'text-red-500'}
                >
                  {change >= 0 ? '↑' : '↓'}{' '}
                  <span>{Math.abs(change).toFixed(2)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
