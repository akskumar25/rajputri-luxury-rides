import { useState, type ReactNode } from "react";
import { Trash2, Plus } from "lucide-react";
import { createDoc, deleteRow, useCollection } from "@/lib/firestore-hooks";

interface Field {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "number" | "textarea" | "date";
  required?: boolean;
}

interface Props {
  collectionName: string;
  title: string;
  description?: string;
  fields: Field[];
  columns: { key: string; label: string; render?: (row: Record<string, unknown>) => ReactNode }[];
}

export function AdminTable({ collectionName, title, description, fields, columns }: Props) {
  const { data, loading, error } = useCollection(collectionName);
  const [form, setForm] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {};
      for (const f of fields) {
        payload[f.name] = f.type === "number" ? Number(form[f.name] ?? 0) : form[f.name] ?? "";
      }
      await createDoc(collectionName, payload);
      setForm({});
      setOpen(false);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      {open && (
        <form onSubmit={submit} className="rounded-lg border bg-card p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((f) => (
              <label key={f.name} className="text-sm space-y-1 block">
                <span className="font-medium">{f.label}</span>
                {f.type === "textarea" ? (
                  <textarea
                    required={f.required}
                    value={form[f.name] ?? ""}
                    onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    rows={3}
                  />
                ) : (
                  <input
                    type={f.type ?? "text"}
                    required={f.required}
                    value={form[f.name] ?? ""}
                    onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  />
                )}
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              disabled={saving}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md border px-4 py-2 text-sm hover:bg-accent"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="rounded-lg border bg-card overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-sm text-muted-foreground">Loading…</div>
        ) : error ? (
          <div className="p-10 text-center text-sm text-destructive">{error}</div>
        ) : data.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">No records yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {columns.map((c) => (
                    <th key={c.key} className="text-left px-4 py-3 font-medium">
                      {c.label}
                    </th>
                  ))}
                  <th className="w-16" />
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id} className="border-t hover:bg-muted/30">
                    {columns.map((c) => (
                      <td key={c.key} className="px-4 py-3">
                        {c.render ? c.render(row) : String(row[c.key] ?? "—")}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          if (confirm("Delete this record?")) deleteRow(collectionName, row.id);
                        }}
                        className="text-destructive hover:opacity-70"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
