export default function DiagnosticosLoading() {
  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-muted animate-pulse shrink-0" />
        <div className="space-y-1.5">
          <div className="h-5 w-44 rounded-lg bg-muted animate-pulse" />
          <div className="h-3 w-56 rounded-lg bg-muted animate-pulse" />
        </div>
      </div>
      <div className="h-10 rounded-xl bg-muted animate-pulse" />
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-8 w-20 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-4 space-y-3 animate-pulse">
            <div className="flex gap-3">
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <div className="h-4 w-16 rounded-full bg-muted" />
                  <div className="h-4 w-20 rounded-full bg-muted" />
                </div>
                <div className="h-4 w-40 rounded-lg bg-muted" />
              </div>
              <div className="w-4 h-4 rounded bg-muted" />
            </div>
            <div className="space-y-1">
              <div className="h-3 rounded-lg bg-muted" />
              <div className="h-3 w-4/5 rounded-lg bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
