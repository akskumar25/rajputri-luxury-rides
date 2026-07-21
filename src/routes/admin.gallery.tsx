import { createFileRoute } from "@tanstack/react-router";
import { AdminTable } from "@/components/admin-table";

export const Route = createFileRoute("/admin/gallery")({
  component: () => (
    <AdminTable
      collectionName="gallery"
      title="Image Gallery"
      description="Photos shown on the website gallery."
      fields={[
        { name: "title", label: "Title", required: true },
        { name: "imageUrl", label: "Image URL", required: true },
        { name: "category", label: "Category (temple/car/customer/trip)" },
      ]}
      columns={[
        {
          key: "imageUrl",
          label: "Image",
          render: (r) => (
            <img
              src={String(r.imageUrl ?? "")}
              alt=""
              className="h-12 w-16 object-cover rounded"
            />
          ),
        },
        { key: "title", label: "Title" },
        { key: "category", label: "Category" },
      ]}
    />
  ),
});
