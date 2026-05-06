export default function EmergenciaLoading() {
  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-muted animate-pulse shrink-0" />
        <div className="space-y-1.5">
          <div className="h-5 w-40 rounded-lg bg-muted animate-pulse" />
          <div className="h-3 w-48 rounded-lg bg-muted animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
            <div className="h-24 bg-muted" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-36 rounded-lg bg-muted" />
              <div className="h-3 rounded-lg bg-muted" />
              <div className="h-3 w-4/5 rounded-lg bg-muted" />
              <div className="flex gap-2 pt-1">
                <div className="h-3 w-16 rounded-full bg-muted" />
                <div className="h-3 w-12 rounded-full bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
