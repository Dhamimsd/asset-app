"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { AssignedEmployee } from "@/lib/model";

export type AssetFormValues = {
  brand: string;
  status: string;
  serial_no: string;
  ram: string;
  ssd: string;
  gen: string;
  series: string;
  assigned_to?: string | null;
};

export type AssetFormProps<
  T extends {
    _id?: string;
    brand: string;
    serial_no: string;
    status: string;
    ram: string;
    ssd: string;
    gen: string;
    series: string;
    assigned_to?: string | AssignedEmployee | null;
  }
> = {
  rowData?: T;
  onClose?: () => void;
  onSave: (data: T) => void;
  apiEndpoint: string;
  assetType: string; // for fetching available employees
  title?: string;
};

const STATUSES = ["STORE", "USED", "REPAIR"];

export default function AssetForm<
  T extends {
    _id?: string;
    brand: string;
    serial_no: string;
    status: string;
    ram: string;
    ssd: string;
    gen: string;
    series: string;
    assigned_to?: string | AssignedEmployee | null;
  }
>({ rowData, onClose, onSave, apiEndpoint, assetType, title }: AssetFormProps<T>) {
  const form = useForm<AssetFormValues>({
    defaultValues: {
      brand: rowData?.brand || "",
      serial_no: rowData?.serial_no || "",
      status: rowData?.status || STATUSES[0],
      ram: rowData?.ram || "",
      ssd: rowData?.ssd || "",
      gen: rowData?.gen || "",
      series: rowData?.series || "",
      assigned_to: typeof rowData?.assigned_to === "string" ? rowData.assigned_to : rowData?.assigned_to?._id ?? "",
    },
  });

  const [assignees, setAssignees] = useState<
    { _id: string; employee_name: string; department: string }[]
  >([]);

  const { handleSubmit, reset, formState: { isSubmitting } } = form;

  // Reset form when editing
  useEffect(() => {
    if (rowData) {
      reset({
        brand: rowData.brand,
        serial_no: rowData.serial_no,
        status: rowData.status,
        ram: rowData.ram,
        ssd: rowData.ssd,
        gen: rowData.gen,
        series: rowData.series,
        assigned_to: typeof rowData.assigned_to === "string" ? rowData.assigned_to : rowData.assigned_to?._id ?? "",
      });
    }
  }, [rowData, reset]);

  // Fetch available employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(`/api/employee/available/${assetType}`);
        if (!res.ok) throw new Error("Failed to fetch employees");
        const data = await res.json();
        setAssignees(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load employees");
      }
    };

    fetchEmployees();
  }, [assetType]);

  const onSubmit = async (values: AssetFormValues) => {
    try {
      const method = rowData ? "PUT" : "POST";
      const url = rowData ? `${apiEndpoint}/${rowData._id}` : apiEndpoint;
      const payload = rowData ? { ...rowData, ...values } : values;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      const data = await res.json();
      onSave(data);
      reset();
      onClose?.();
      toast.success(rowData ? "Updated successfully" : "Added successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose?.()}>
      <DialogContent className="max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="font-semibold text-purple-800 dark:text-purple-600">
            {title || (rowData ? "Edit Asset" : "Add Asset")}
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[70vh] px-2">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serial_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial No</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {rowData && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="ram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RAM</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ssd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SSD</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gen"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Generation</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="series"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Series</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {rowData && (
              <FormField
                control={form.control}
                name="assigned_to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned To</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value ?? ""}
                        onValueChange={(value) => field.onChange(value === "" ? null : value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent>
                          {assignees.map((emp) => (
                            <SelectItem key={emp._id} value={emp._id}>
                              {emp.employee_name} — {emp.department}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              )}
              <DialogFooter className="flex justify-end space-x-2 pt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="asia"
                  size="sm"
                >
                  {isSubmitting
                    ? rowData
                      ? "Updating..."
                      : "Saving..."
                    : rowData
                      ? "Update"
                      : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
