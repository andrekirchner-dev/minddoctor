export default function SettingsLoading() {
  return (
    <div className="space-y-5 max-w-xl animate-pulse">
      <div className="space-y-1">
        <div className="h-6 w-36 rounded bg-muted" />
        <div className="h-3 w-52 rounded bg-muted" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <div className="h-3 w-28 rounded bg-muted" />
          </div>
          <div className="divide-y divide-border">
            {Array.from({ length: i === 1 ? 3 : 2 }).map((_, j) => (
              <div key={j} className="px-5 py-3.5 flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-muted shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="h-3.5 w-40 rounded bg-muted" />
                  <div className="h-2.5 w-56 rounded bg-muted" />
                </div>
                <div className="w-10 h-5 rounded-full bg-muted shrink-0" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
