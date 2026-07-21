import { createFileRoute } from "@tanstack/react-router";
import { AdminTable } from "@/components/admin-table";

export const Route = createFileRoute("/admin/packages")({
  component: () => (
    <AdminTable
      collectionName="packages"
      title="Tour Packages"
      description="Temple tours and outstation packages."
      fields={[
        { name: "name", label: "Package name", required: true },
        { name: "duration", label: "Duration (e.g., 2 days)" },
        { name: "places", label: "Places covered", type: "textarea" },
        { name: "price", label: "Price (₹)", type: "number", required: true },
        { name: "imageUrl", label: "Image URL" },
        { name: "active", label: "Active (yes/no)" },
      ]}
      columns={[
        { key: "name", label: "Name" },
        { key: "duration", label: "Duration" },
        { key: "price", label: "Price", render: (r) => `₹${Number(r.price ?? 0).toLocaleString("en-IN")}` },
        { key: "active", label: "Active" },
      ]}
    />
  ),
});
