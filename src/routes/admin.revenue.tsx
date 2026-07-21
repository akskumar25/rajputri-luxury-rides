import { createFileRoute } from "@tanstack/react-router";
import { useCollection } from "@/lib/firestore-hooks";

export const Route = createFileRoute("/admin/revenue")({
  component: Revenue,
});

function Revenue() {
  const { data } = useCollection("payments");

  const byMonth = new Map<string, number>();
  for (const p of data) {
    const d = String(p.date ?? "").slice(0, 7);
    if (!d) continue;
    byMonth.set(d, (byMonth.get(d) ?? 0) + (Number(p.amount) || 0));
  }
  const months = [...byMonth.entries()].sort(([a], [b]) => a.localeCompare(b));
  const total = data.reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const paid = data.filter((p) => p.status === "paid").reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const pending = data.filter((p) => p.status === "pending").reduce((s, p) => s + (Number(p.amount) || 0), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Revenue Reports</h1>
        <p className="text-sm text-muted-foreground">Track earnings across time.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-5">
          <div className="text-xs text-muted-foreground">Total revenue</div>
          <div className="text-2xl font-bold">₹{total.toLocaleString("en-IN")}</div>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="text-xs text-muted-foreground">Paid</div>
          <div className="text-2xl font-bold text-green-600">₹{paid.toLocaleString("en-IN")}</div>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="text-xs text-muted-foreground">Pending</div>
          <div className="text-2xl font-bold text-amber-600">₹{pending.toLocaleString("en-IN")}</div>
        </div>
      </div>
      <div className="rounded-xl border bg-card p-5">
        <h2 className="font-semibold mb-4">Monthly revenue</h2>
        {months.length === 0 ? (
          <p className="text-sm text-muted-foreground">No payments recorded.</p>
        ) : (
          <div className="space-y-2">
            {months.map(([m, v]) => (
              <div key={m} className="flex justify-between text-sm border-b pb-2">
                <span>{m}</span>
                <span className="font-medium">₹{v.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
