import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/admin/login")({
  component: LoginPage,
});

function LoginPage() {
  const { signIn, user } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) nav({ to: "/admin" });
  }, [user, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await signIn(email, pwd);
      nav({ to: "/admin" });
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-xl border bg-card p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-bold">Admin Sign In</h1>
          <p className="text-xs text-muted-foreground">Rajputri Tours & Travels</p>
        </div>
        <label className="block text-sm space-y-1">
          <span className="font-medium">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm space-y-1">
          <span className="font-medium">Password</span>
          <input
            type="password"
            required
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </label>
        {err && <div className="text-xs text-destructive">{err}</div>}
        <button
          disabled={loading}
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <p className="text-xs text-muted-foreground">
          Create the admin user in Firebase Console → Authentication → Users.
        </p>
      </form>
    </div>
  );
}
