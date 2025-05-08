export function Loading({
  type = 'default',
}: {
  type?: 'card' | 'chart' | 'grid' | 'default';
}) {
  if (type === 'card') {
    return (
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="space-y-3">
          <div
            data-testid="loading-skeleton"
            className="h-4 w-[60%] rounded-md bg-muted animate-pulse"
          />
          <div
            data-testid="loading-skeleton"
            className="h-8 w-[40%] rounded-md bg-muted animate-pulse"
          />
        </div>
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="space-y-4">
          <div
            data-testid="loading-skeleton"
            className="h-4 w-[40%] rounded-md bg-muted animate-pulse"
          />
          <div
            data-testid="loading-skeleton"
            className="h-[200px] w-full rounded-md bg-muted animate-pulse"
          />
        </div>
      </div>
    );
  }

  if (type === 'grid') {
    return (
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="p-4 space-y-4">
          <div
            data-testid="loading-skeleton"
            className="h-4 w-[40%] rounded-md bg-muted animate-pulse"
          />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                data-testid="loading-skeleton"
                className="h-12 w-full rounded-md bg-muted animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-full min-h-[200px]">
      <div className="flex flex-col items-center gap-2">
        <div
          role="status"
          className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"
        />
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    </div>
  );
}
