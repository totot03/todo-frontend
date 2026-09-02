import { Badge } from "@/components/ui/badge";
import type { Priority } from "@/types/api";

const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; variant: "destructive" | "secondary" | "outline" }
> = {
  HIGH: { label: "높음", variant: "destructive" },
  MEDIUM: { label: "보통", variant: "secondary" },
  LOW: { label: "낮음", variant: "outline" },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const { label, variant } = PRIORITY_CONFIG[priority];
  return <Badge variant={variant}>{label}</Badge>;
}
