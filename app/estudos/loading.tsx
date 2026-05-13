export default function EstudosLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-muted animate-pulse shrink-0" />
        <div className="space-y-1.5">
          <div className="h-5 w-40 rounded-lg bg-muted animate-pulse" />
          <div className="h-3 w-56 rounded-lg bg-muted animate-pulse" />
        </div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-6 flex items-start gap-5 animate-pulse">
            <div className="w-12 h-12 rounded-xl bg-muted shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 rounded-lg bg-muted" />
              <div className="h-3 w-56 rounded-lg bg-muted" />
              <div className="h-3 w-48 rounded-lg bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
