import type { OrderStatus } from "@/lib/mock-data";
import { Check, Clock } from "lucide-react";

const FLOW: OrderStatus[] = ["pending", "confirmed", "processing", "packed", "shipped", "out_for_delivery", "delivered"];

export function StatusTimeline({
  current,
  history,
}: {
  current: OrderStatus;
  history: { status: OrderStatus; at: string; note?: string }[];
}) {
  const terminated = ["cancelled", "returned", "refunded"].includes(current);
  const currentIdx = FLOW.indexOf(current);
  return (
    <ol className="space-y-4">
      {FLOW.map((s, i) => {
        const done = !terminated && i <= currentIdx;
        const entry = [...history].reverse().find((h) => h.status === s);
        return (
          <li key={s} className="flex gap-3">
            <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${done ? "border-primary bg-primary text-primary-foreground" : "border-border bg-muted text-muted-foreground"}`}>
              {done ? <Check className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-medium capitalize ${done ? "" : "text-muted-foreground"}`}>{s.replace(/_/g, " ")}</p>
              {entry && (
                <p className="text-xs text-muted-foreground">{new Date(entry.at).toLocaleString()}</p>
              )}
            </div>
          </li>
        );
      })}
      {terminated && (
        <li className="rounded-md border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-400">
          Order {current}
        </li>
      )}
    </ol>
  );
}
