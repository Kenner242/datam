export default function ProgressBar({
  label,
  percent,
}: {
  label: string;
  percent: number;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="w-32 shrink-0 text-sm font-medium text-ink">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-accent"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="w-10 text-right font-mono text-xs text-muted">
        {percent}%
      </span>
    </div>
  );
}
