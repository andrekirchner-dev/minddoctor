export default function GlossarioLoading() {
  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-muted animate-pulse shrink-0" />
        <div className="space-y-1.5">
          <div className="h-5 w-48 rounded-lg bg-muted animate-pulse" />
          <div className="h-3 w-40 rounded-lg bg-muted animate-pulse" />
        </div>
      </div>
      <div className="h-10 rounded-xl bg-muted animate-pulse" />
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-8 w-24 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-3 animate-pulse">
            <div className="h-4 w-36 rounded-lg bg-muted flex-1" />
            <div className="h-4 w-4 rounded bg-muted shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
