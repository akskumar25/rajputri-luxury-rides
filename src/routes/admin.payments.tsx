import { createFileRoute } from "@tanstack/react-router";
import { AdminTable } from "@/components/admin-table";

export const Route = createFileRoute("/admin/payments")({
  component: () => (
    <AdminTable
      collectionName="payments"
      title="Payments"
      description="Record all payments received."
      fields={[
        { name: "bookingId", label: "Booking ID" },
        { name: "customerName", label: "Customer" },
        { name: "amount", label: "Amount (₹)", type: "number", required: true },
        { name: "method", label: "Method (cash/upi/card)" },
        { name: "date", label: "Date", type: "date", required: true },
        { name: "status", label: "Status (paid/pending/refunded)" },
      ]}
      columns={[
        { key: "date", label: "Date" },
        { key: "customerName", label: "Customer" },
        { key: "amount", label: "Amount", render: (r) => `₹${Number(r.amount ?? 0).toLocaleString("en-IN")}` },
        { key: "method", label: "Method" },
        { key: "status", label: "Status" },
      ]}
    />
  ),
});
