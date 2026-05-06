export default function BibliotecaLoading() {
  return (
    <div className="min-h-screen bg-background p-6 space-y-5 max-w-2xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-muted animate-pulse" />
        <div className="space-y-1.5">
          <div className="h-5 w-48 rounded-lg bg-muted animate-pulse" />
          <div className="h-3 w-64 rounded-lg bg-muted animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-6 space-y-4 animate-pulse">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 rounded-lg bg-muted" />
                <div className="h-3 w-20 rounded-lg bg-muted" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-3 rounded-lg bg-muted" />
              <div className="h-3 w-4/5 rounded-lg bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
