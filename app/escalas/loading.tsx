export default function EscalasLoading() {
  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-muted animate-pulse shrink-0" />
        <div className="space-y-1.5">
          <div className="h-5 w-36 rounded-lg bg-muted animate-pulse" />
          <div className="h-3 w-44 rounded-lg bg-muted animate-pulse" />
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-24 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-4 flex gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-muted shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 rounded-lg bg-muted" />
              <div className="h-3 w-full rounded-lg bg-muted" />
              <div className="h-3 w-4/5 rounded-lg bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
