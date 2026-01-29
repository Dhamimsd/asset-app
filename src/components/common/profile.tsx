"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import { SheetContent } from "../ui/sheet-content";
import { IEmployee } from "@/lib/model";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { toast } from "sonner";

type EmployeeDetailsProps = {
  _id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function EmployeeDetails({
  _id,
  open,
  onOpenChange,
}: EmployeeDetailsProps) {
  const [employee, setEmployee] = useState<IEmployee | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !_id) return;

    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/employee/${_id}`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error();
        const data: IEmployee = await res.json();
        setEmployee(data);
      } catch {
        toast.error("Failed to fetch employee");
        setEmployee(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [_id, open]);

  function formatSriLankaDate(dateString?: string) {
    if (!dateString) return "—";

    return new Intl.DateTimeFormat("en-LK", {
      timeZone: "Asia/Colombo",
      year: "numeric",
      month: "long",
      day: "2-digit",
    }).format(new Date(dateString));
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md border-gray-900">
        <SheetHeader>
          <SheetTitle> Employee Details</SheetTitle>
          <SheetDescription>Complete Employee information</SheetDescription>
        </SheetHeader>

        {loading ? (
          <div className="flex items-center gap-3 mt-6">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-6 w-32" />
          </div>
        ) : !employee ? (
          <span className="text-gray-500 text-sm mt-6 block">
            Employee not found
          </span>
        ) : (
          <div className="mt-6 border rounded-2xl border-gray-200 dark:border-neutral-800 p-6 shadow-sm bg-white dark:bg-neutral-900">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 ring-2 ring-gray-200 dark:ring-neutral-800">
                <AvatarFallback>
                  {employee?.employee_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-lg">
                  {employee.employee_name}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Deparment</span>
                <span>{employee?.department || "—"}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Type</span>
                <span>{employee?.employment_type || "—"}</span>
                {employee?.temp_end_date && (
                  <span>{formatSriLankaDate(employee?.temp_end_date)}</span>
                )}
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500"></span>
                <span>{employee?.status || "—"}</span>
              </div>

              <hr className="my-3 dark:border-neutral-800" />

              <div className="flex justify-between items-start">
                <span className="text-gray-500">Mouse id</span>
                <span>{employee?.mouse_id || "—"}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-500">Keyboard id</span>
                <span>{employee?.keyboard_id || "—"}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-500">Monitor id</span>
                <span>{employee?.monitor_id || "—"}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-500">Headset id</span>
                <span>{employee?.heatset_id || "—"}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-500">Laptop id</span>
                <span>{employee?.laptop_id || "—"}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-500">Phone id</span>
                <span>{employee?.phone_id || "—"}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-500">Pc id</span>
                <span>{employee?.pc_id || "—"}</span>
              </div>
            </div>
        
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
