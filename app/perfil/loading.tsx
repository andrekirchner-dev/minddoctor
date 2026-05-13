export default function PerfilLoading() {
  return (
    <div className="space-y-5 max-w-xl animate-pulse">
      <div className="space-y-1">
        <div className="h-6 w-32 rounded bg-muted" />
        <div className="h-3 w-56 rounded bg-muted" />
      </div>
      <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-muted shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-36 rounded bg-muted" />
          <div className="h-3 w-48 rounded bg-muted" />
          <div className="h-4 w-16 rounded-full bg-muted" />
        </div>
      </div>
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <div className="h-3 w-40 rounded bg-muted" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-3 w-24 rounded bg-muted" />
            <div className="h-9 w-full rounded-xl bg-muted" />
          </div>
        ))}
        <div className="h-10 w-full rounded-xl bg-muted" />
      </div>
    </div>
  );
}
