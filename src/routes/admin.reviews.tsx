import { createFileRoute } from "@tanstack/react-router";
import { AdminTable } from "@/components/admin-table";

export const Route = createFileRoute("/admin/reviews")({
  component: () => (
    <AdminTable
      collectionName="reviews"
      title="Customer Reviews"
      description="Moderate and manage customer testimonials."
      fields={[
        { name: "name", label: "Customer name", required: true },
        { name: "rating", label: "Rating (1-5)", type: "number", required: true },
        { name: "message", label: "Review", type: "textarea", required: true },
        { name: "approved", label: "Approved (yes/no)" },
      ]}
      columns={[
        { key: "name", label: "Name" },
        { key: "rating", label: "Rating" },
        { key: "message", label: "Review" },
        { key: "approved", label: "Approved" },
      ]}
    />
  ),
});
