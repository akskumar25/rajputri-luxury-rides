import { createFileRoute } from "@tanstack/react-router";
import { AdminTable } from "@/components/admin-table";

export const Route = createFileRoute("/admin/drivers")({
  component: () => (
    <AdminTable
      collectionName="drivers"
      title="Drivers"
      description="Manage drivers and vehicles."
      fields={[
        { name: "name", label: "Driver name", required: true },
        { name: "phone", label: "Phone", type: "tel", required: true },
        { name: "license", label: "License number" },
        { name: "vehicleModel", label: "Vehicle model" },
        { name: "vehicleNumber", label: "Vehicle number" },
        { name: "status", label: "Status (active/inactive)" },
      ]}
      columns={[
        { key: "name", label: "Name" },
        { key: "phone", label: "Phone" },
        { key: "vehicleModel", label: "Vehicle" },
        { key: "vehicleNumber", label: "Reg. No." },
        { key: "status", label: "Status" },
      ]}
    />
  ),
});
