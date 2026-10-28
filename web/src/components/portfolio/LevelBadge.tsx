import { LEVEL_LABELS, LEVEL_BADGE_CLASSES, LEVEL_DESCRIPTIONS } from "@/utils/constants";
import { cn } from "@/lib/utils";

interface LevelBadgeProps {
  level?: number | null;
  size?: "sm" | "md";
  className?: string;
}

export default function LevelBadge({ level, size = "md", className }: LevelBadgeProps) {
  const isUnassessed = level == null || level <= 0 || !LEVEL_LABELS[level];

  if (isUnassessed) {
    return (
      <div
        className={cn(
          "inline-flex flex-col items-center justify-center rounded font-medium bg-slate-100 text-slate-600 border border-slate-300",
          size === "md" ? "px-3 py-2 min-w-14 text-sm" : "px-2 py-1 min-w-10 text-xs",
          className
        )}
        data-testid="level-badge-unassessed"
      >
        <span>—</span>
        {size === "md" && (
          <span className="text-[10px] font-normal opacity-75">Not Assessed</span>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex flex-col items-center justify-center rounded font-semibold",
        size === "md" ? "px-3 py-2 min-w-14 text-base" : "px-2 py-1 min-w-10 text-sm",
        LEVEL_BADGE_CLASSES[level],
        className
      )}
    >
      <span>{LEVEL_LABELS[level]}</span>
      {size === "md" && (
        <span className="text-[10px] font-normal opacity-70">{LEVEL_DESCRIPTIONS[level]}</span>
      )}
    </div>
  );
}
