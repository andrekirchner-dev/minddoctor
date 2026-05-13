export default function IALoading() {
  return (
    <div className="space-y-6 max-w-2xl animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-muted" />
        <div className="space-y-1.5">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-3 w-40 rounded bg-muted" />
        </div>
      </div>
      <div className="h-28 rounded-2xl bg-muted" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-muted" />
        ))}
      </div>
    </div>
  );
}
