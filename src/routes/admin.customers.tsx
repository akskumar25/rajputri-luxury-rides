import { createFileRoute } from "@tanstack/react-router";
import { AdminTable } from "@/components/admin-table";

export const Route = createFileRoute("/admin/customers")({
  component: () => (
    <AdminTable
      collectionName="customers"
      title="Customers"
      description="Manage your customer database."
      fields={[
        { name: "name", label: "Name", required: true },
        { name: "phone", label: "Phone", type: "tel", required: true },
        { name: "email", label: "Email", type: "email" },
        { name: "city", label: "City" },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
      columns={[
        { key: "name", label: "Name" },
        { key: "phone", label: "Phone" },
        { key: "email", label: "Email" },
        { key: "city", label: "City" },
      ]}
    />
  ),
});
