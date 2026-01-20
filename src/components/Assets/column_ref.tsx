"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { EditIcon, Trash2 } from "lucide-react";

export const assetColumns = <T extends { _id: string; brand: string;model: string; status: string; assigned_to?: string;  }>(
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
    accessorKey: "assigned_to",
    header: "Assigned To",
    cell: ({ row }) => row.original.assigned_to || "—", 
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
