import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Car,
  CreditCard,
  Package,
  Image as ImageIcon,
  Star,
  Mail,
  BarChart3,
  IndianRupee,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const items = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/bookings", label: "Bookings", icon: Calendar },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/drivers", label: "Drivers", icon: Car },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
  { to: "/admin/packages", label: "Tour Packages", icon: Package },
  { to: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/inquiries", label: "Inquiries", icon: Mail },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/revenue", label: "Revenue", icon: IndianRupee },
] as { to: string; label: string; icon: React.ComponentType<{ className?: string }>; exact?: boolean }[];

export function AdminSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, signOutUser } = useAuth();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-card">
      <div className="p-5 border-b">
        <div className="font-bold text-lg tracking-tight">Rajputri Admin</div>
        <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {items.map((it) => {
          const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent"
              }`}
            >
              <Icon className="h-4 w-4" />
              {it.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={() => signOutUser()}
        className="m-3 flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent"
      >
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    </aside>
  );
}
