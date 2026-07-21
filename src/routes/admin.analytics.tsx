import { createFileRoute } from "@tanstack/react-router";
import { useCollection } from "@/lib/firestore-hooks";

export const Route = createFileRoute("/admin/analytics")({
  component: Analytics,
});

function Analytics() {
  const bookings = useCollection("bookings");
  const byService = new Map<string, number>();
  const byStatus = new Map<string, number>();
  for (const b of bookings.data) {
    const s = String(b.serviceType ?? "Other");
    byService.set(s, (byService.get(s) ?? 0) + 1);
    const st = String(b.status ?? "pending");
    byStatus.set(st, (byStatus.get(st) ?? 0) + 1);
  }

  const total = bookings.data.length;

  const Bar = ({ label, value }: { label: string; value: number }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span>{label}</span>
        <span className="text-muted-foreground">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-primary" style={{ width: `${total ? (value / total) * 100 : 0}%` }} />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">Booking insights across services.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 space-y-3">
          <h2 className="font-semibold">Bookings by service</h2>
          {[...byService.entries()].map(([k, v]) => (
            <Bar key={k} label={k} value={v} />
          ))}
          {byService.size === 0 && <p className="text-sm text-muted-foreground">No data yet.</p>}
        </div>
        <div className="rounded-xl border bg-card p-5 space-y-3">
          <h2 className="font-semibold">Bookings by status</h2>
          {[...byStatus.entries()].map(([k, v]) => (
            <Bar key={k} label={k} value={v} />
          ))}
          {byStatus.size === 0 && <p className="text-sm text-muted-foreground">No data yet.</p>}
        </div>
      </div>
    </div>
  );
}
