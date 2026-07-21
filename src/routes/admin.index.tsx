import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Users, Car, IndianRupee, Star, Mail } from "lucide-react";
import { useCollection } from "@/lib/firestore-hooks";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | number }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const bookings = useCollection("bookings");
  const customers = useCollection("customers");
  const drivers = useCollection("drivers");
  const payments = useCollection("payments");
  const reviews = useCollection("reviews");
  const inquiries = useCollection("inquiries");

  const revenue = payments.data.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Live overview of your business.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Stat icon={Calendar} label="Bookings" value={bookings.data.length} />
        <Stat icon={Users} label="Customers" value={customers.data.length} />
        <Stat icon={Car} label="Drivers" value={drivers.data.length} />
        <Stat icon={IndianRupee} label="Revenue" value={`₹${revenue.toLocaleString("en-IN")}`} />
        <Stat icon={Star} label="Reviews" value={reviews.data.length} />
        <Stat icon={Mail} label="Inquiries" value={inquiries.data.length} />
      </div>

      <div className="rounded-xl border bg-card p-5">
        <h2 className="font-semibold mb-4">Recent bookings</h2>
        {bookings.data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No bookings yet.</p>
        ) : (
          <ul className="divide-y">
            {bookings.data.slice(0, 8).map((b) => (
              <li key={b.id} className="py-3 flex justify-between text-sm">
                <span>{String(b.customerName ?? "—")} • {String(b.serviceType ?? "—")}</span>
                <span className="text-muted-foreground">{String(b.pickupDate ?? "")}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
