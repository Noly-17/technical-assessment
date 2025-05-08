'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { fetchMetrics } from '../api/mock-data';
import type { TimeSeriesData } from '../api/mock-data';

interface TimeRangeContextType {
  timeRange: 'hour' | 'day' | 'week';
  setTimeRange: (range: 'hour' | 'day' | 'week') => void;
  data: TimeSeriesData[];
}

const TimeRangeContext = createContext<TimeRangeContextType | null>(null);

export function useTimeRange() {
  const context = useContext(TimeRangeContext);
  if (!context) {
    throw new Error('useTimeRange must be used within a TimeRangeProvider');
  }
  return context;
}

interface TimeRangeProviderProps {
  children: ReactNode;
  initialRange: 'hour' | 'day' | 'week';
  initialData: TimeSeriesData[];
}

export function TimeRangeProvider({
  children,
  initialRange,
  initialData,
}: TimeRangeProviderProps) {
  const [timeRange, setTimeRangeState] = useState<'hour' | 'day' | 'week'>(
    initialRange
  );
  const [data, setData] = useState<TimeSeriesData[]>(initialData);

  const setTimeRange = useCallback(async (range: 'hour' | 'day' | 'week') => {
    setTimeRangeState(range);
    try {
      const newData = await fetchMetrics(range);
      setData(newData);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    }
  }, []);

  return (
    <TimeRangeContext.Provider value={{ timeRange, setTimeRange, data }}>
      {children}
    </TimeRangeContext.Provider>
  );
}
