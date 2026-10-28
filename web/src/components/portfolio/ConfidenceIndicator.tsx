interface ConfidenceIndicatorProps {
  confidence?: string; // "high" | "medium" | "low" | "unassessed" from API
}

function getLabel(c?: string): "HIGH" | "MEDIUM" | "LOW" | "UNASSESSED" {
  const normalized = c?.toLowerCase();
  if (normalized === "high") return "HIGH";
  if (normalized === "medium") return "MEDIUM";
  if (normalized === "low") return "LOW";
  return "UNASSESSED";
}

export default function ConfidenceIndicator({ confidence }: ConfidenceIndicatorProps) {
  const label = getLabel(confidence);

  if (label === "HIGH") {
    return (
      <span className="flex items-center gap-1 text-xs text-green-600">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        Confidence: HIGH
      </span>
    );
  }
  if (label === "MEDIUM") {
    return (
      <span className="flex items-center gap-1 text-xs text-amber-600">
        <span className="h-2 w-2 rounded-full bg-amber-400" />
        Confidence: MEDIUM
      </span>
    );
  }
  if (label === "LOW") {
    return (
      <span className="flex items-center gap-1 text-xs text-destructive">
        <span className="h-2 w-2 rounded-full bg-destructive" />
        Confidence: LOW
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs text-slate-500" data-testid="confidence-unassessed">
      <span className="h-2 w-2 rounded-full bg-slate-400" />
      Confidence: Not Assessed
    </span>
  );
}
