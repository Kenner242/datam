export default function ProgressBar({
  label,
  percent,
}: {
  label: string;
  percent: number;
}) {
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <span className="w-24 shrink-0 truncate text-sm font-medium text-ink sm:w-32">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-accent"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="w-8 text-right font-mono text-xs text-muted sm:w-10">
        {percent}%
      </span>
    </div>
  );
}
