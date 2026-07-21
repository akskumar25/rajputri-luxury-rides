import { createFileRoute } from "@tanstack/react-router";
import { AdminTable } from "@/components/admin-table";

export const Route = createFileRoute("/admin/inquiries")({
  component: () => (
    <AdminTable
      collectionName="inquiries"
      title="Contact Inquiries"
      description="Messages submitted via the contact form."
      fields={[
        { name: "name", label: "Name", required: true },
        { name: "phone", label: "Phone", type: "tel" },
        { name: "email", label: "Email", type: "email" },
        { name: "message", label: "Message", type: "textarea", required: true },
        { name: "status", label: "Status (new/replied/closed)" },
      ]}
      columns={[
        { key: "name", label: "Name" },
        { key: "phone", label: "Phone" },
        { key: "email", label: "Email" },
        { key: "status", label: "Status" },
      ]}
    />
  ),
});
