'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { TimeSeriesData } from '../api/mock-data';
import { useTimeRange } from './time-range-provider';

interface MetricsChartProps {
  data: TimeSeriesData[];
  timeRange: 'hour' | 'day' | 'week';
  setTimeRange: (range: 'hour' | 'day' | 'week') => void;
}

export function MetricsChart() {
  const { data, timeRange, setTimeRange }: MetricsChartProps = useTimeRange();

  return (
    <div className="p-4 rounded-lg bg-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Metrics Over Time</h2>
        <div className="space-x-2">
          {['hour', 'day', 'week'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range as 'hour' | 'day' | 'week')}
              className={`px-3 py-1 rounded ${
                timeRange === range
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(time) => new Date(time).toLocaleTimeString()}
              className="text-muted-foreground"
            />
            <YAxis className="text-muted-foreground" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
