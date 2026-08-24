import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/lib/mock-data";

const STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
  confirmed: "bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30",
  processing: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-500/30",
  packed: "bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/30",
  shipped: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
  out_for_delivery: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/30",
  delivered: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  cancelled: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30",
  returned: "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30",
  refunded: "bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/30",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant="outline" className={`capitalize ${STYLES[status]}`}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export const ORDER_STATUSES: OrderStatus[] = [
  "pending","confirmed","processing","packed","shipped","out_for_delivery","delivered","cancelled","returned","refunded",
];
