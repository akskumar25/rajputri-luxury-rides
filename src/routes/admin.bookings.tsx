import { createFileRoute } from "@tanstack/react-router";
import { AdminTable } from "@/components/admin-table";

export const Route = createFileRoute("/admin/bookings")({
  component: () => (
    <AdminTable
      collectionName="bookings"
      title="Bookings"
      description="All ride bookings from customers."
      fields={[
        { name: "customerName", label: "Customer", required: true },
        { name: "phone", label: "Phone", type: "tel", required: true },
        { name: "serviceType", label: "Service (Airport / Temple / Outstation / Local)", required: true },
        { name: "pickup", label: "Pickup location", required: true },
        { name: "drop", label: "Drop location" },
        { name: "pickupDate", label: "Pickup date", type: "date", required: true },
        { name: "pickupTime", label: "Pickup time" },
        { name: "status", label: "Status (pending/confirmed/completed/cancelled)" },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
      columns={[
        { key: "customerName", label: "Customer" },
        { key: "phone", label: "Phone" },
        { key: "serviceType", label: "Service" },
        { key: "pickup", label: "Pickup" },
        { key: "pickupDate", label: "Date" },
        { key: "status", label: "Status" },
      ]}
    />
  ),
});
