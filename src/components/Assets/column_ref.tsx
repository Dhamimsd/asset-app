"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { EditIcon, Trash2 } from "lucide-react";
import { AssignedEmployee } from "@/lib/model"; 

export const assetColumns = <T extends { _id: string; brand: string;model: string; status: string; assigned_to?: string | AssignedEmployee | null;updatedAt?: Date; }>(
  onManage: (row: T) => void,
  onDelete: (row: T) => void
): ColumnDef<T>[] => [
  {
    accessorKey: "_id",
    header: "ID",
  },
  {
    accessorKey: "brand",
    header: "Brand",
  },
  {
    accessorKey: "model",
    header: "Model",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
 {
    header: "Assigned To",
    cell: ({ row }) => {
      const assigned = row.original.assigned_to;
      if (!assigned) return "—";
      if (typeof assigned === "string") return assigned;
      return assigned.employee_name;
    },
  },
 {
  accessorKey: "updatedAt",
  header: "Updated At",
  cell: ({ row }) => {
    const value = row.original.updatedAt;
    if (!value) return "—";

    return new Date(value).toLocaleString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  },
},
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button size="sm" variant="asia" onClick={() => onManage(row.original)}>
          <EditIcon className="mr-2 h-4 w-4" />
        </Button>
        <Button size="sm" variant="destructive" onClick={() => onDelete(row.original)}>
          <Trash2 className="mr-2 h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
