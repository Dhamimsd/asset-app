"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { IEmployee } from "@/lib/model";
import { EditIcon, Trash2 } from "lucide-react";
import StatusDot from "@/components/common/status";
import Profile from "@/components/common/profile";
import { useState } from "react";

export const employeeColumns = (
  onManage: (row: IEmployee) => void,
  onDelete: (row: IEmployee) => void
): ColumnDef<IEmployee>[] => [
    {
    accessorKey: "_id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.getValue("_id") as string;
      return <EmployeeNameCell id={id} />;
    },
    
  },
    {
      accessorKey: "employee_name",
      header: "Employee Name",
    },
    {
      accessorKey: "department",
      header: "Department",
    },
    {
      accessorKey: "keyboard_id",
      header: "Keyboard ID",
      cell: ({ row }) => {
        const { keyboard_id, keyboard_status } = row.original;

        if (keyboard_status === "STORE" || !keyboard_id) {
          return null;
        }

        return (
          <div className="relative flex flex-col w-full h-10">
            <div className="flex justify-end">
              <StatusDot status={keyboard_status} />
            </div>

            <div className="mt-1 flex justify-start">
              <span className="text-sm font-medium">{keyboard_id}</span>
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "mouse_id",
      header: "Mouse ID",
      cell: ({ row }) => {
        const { mouse_id, mouse_status } = row.original;

        if (mouse_status === "STORE" || !mouse_id) {
          return null;
        }

        return (
          <div className="relative flex flex-col w-full h-10">
            <div className="flex justify-end">
              <StatusDot status={mouse_status} />
            </div>

            <div className="mt-1 flex justify-start">
              <span className="text-sm font-medium">{mouse_id}</span>
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "pc_id",
      header: "PC ID",
      cell: ({ row }) => {
        const { pc_id, pc_status } = row.original;

        if (pc_status === "STORE" || !pc_id) {
          return null;
        }

        return (
          <div className="relative flex flex-col w-full h-10">
            <div className="flex justify-end">
              <StatusDot status={pc_status} />
            </div>

            <div className="mt-1 flex justify-start">
              <span className="text-sm font-medium">{pc_id}</span>
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "heatset_id",
      header: "Heatset ID",
      cell: ({ row }) => {
        const { heatset_id, heatset_status } = row.original;

        if (heatset_status === "STORE" || !heatset_id) {
          return null;
        }

        return (
          <div className="relative flex flex-col w-full h-10">
            <div className="flex justify-end">
              <StatusDot status={heatset_status} />
            </div>

            <div className="mt-1 flex justify-start">
              <span className="text-sm font-medium">{heatset_id}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "laptop_id",
      header: "Laptop ID",
      cell: ({ row }) => {
        const { laptop_id, laptop_status } = row.original;

        if (laptop_status === "STORE" || !laptop_id) {
          return null;
        }

        return (
          <div className="relative flex flex-col w-full h-10">
            <div className="flex justify-end">
              <StatusDot status={laptop_status} />
            </div>

            <div className="mt-1 flex justify-start">
              <span className="text-sm font-medium">{laptop_id}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "phone_id",
      header: "Phone ID",
      cell: ({ row }) => {
        const { phone_id, phone_status } = row.original;

        if (phone_status === "STORE" || !phone_id) {
          return null;
        }

        return (
          <div className="relative flex flex-col w-full h-10">
            <div className="flex justify-end">
              <StatusDot status={phone_status} />
            </div>

            <div className="mt-1 flex justify-start">
              <span className="text-sm font-medium">{phone_id}</span>
            </div>
          </div>
        );
      },
    },

     {
      accessorKey: "monitor_id",
      header: "Monitor ID",
      cell: ({ row }) => {
        const { monitor_id, monitor_status } = row.original;

        if (monitor_status === "STORE" || !monitor_id) {
          return null;
        }

        return (
          <div className="relative flex flex-col w-full h-10">
            <div className="flex justify-end">
              <StatusDot status={monitor_status} />
            </div>

            <div className="mt-1 flex justify-start">
              <span className="text-sm font-medium">{monitor_id}</span>
            </div>
          </div>
        );
      },
    },
    // {
    //   accessorKey: "status",
    //   header: "Status",
    // },


    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="asia"
            onClick={() => onManage(row.original)}
          >
            <EditIcon className="h-3 w-3" />

          </Button>
          <Button
            size="icon"
            variant="destructive"
            onClick={() => onDelete(row.original)}
          >
            <Trash2 className="h-3 w-3" />

          </Button>
        </div>
      ),
    }



  ];


  const EmployeeNameCell = ({ id }: {id: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <span
        className="cursor-pointer text-primary hover:underline"
        onClick={() => setOpen(true)}
      >
        {id}
      </span>

      <Profile _id={id} open={open} onOpenChange={setOpen} />
    </>
  );
};
