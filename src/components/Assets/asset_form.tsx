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

/* ---------------- Types ---------------- */

export type AssetFormValues = {
  brand: string;
  model: string;
  status: string;
  assigned_to?: string | null;
};

export type AssetFormProps<
  T extends {
    _id?: string;
    brand: string;
    model: string;
    status: string;
    assigned_to?: string | AssignedEmployee | null;
  },
> = {
  rowData?: T;
  onClose?: () => void;
  onSave: (data: T) => void;
  apiEndpoint: string;
  assetType:
  | "mouse"
  | "keyboard"
  | "heatset"
  | "laptop"
  | "pc"
  | "monitor"
  | "phone";
  title?: string;
};

const STATUSES = ["STORE", "USED", "REPAIR"];

/* ---------------- Component ---------------- */

export default function AssetForm<
  T extends {
    _id?: string;
    brand: string;
    model: string;
    status: string;
    assigned_to?: string | AssignedEmployee | null;
  },
>({
  rowData,
  onClose,
  onSave,
  apiEndpoint,
  assetType,
  title,
}: AssetFormProps<T>) {
  const form = useForm<AssetFormValues>({
    defaultValues: {
      brand: "",
      model: "",
      status: "STORE",
      assigned_to: "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  const [assignees, setAssignees] = useState<
    { _id: string; employee_name: string; department: string }[]
  >([]);

  /* ---------- Load form data when editing ---------- */
  useEffect(() => {
    if (rowData) {
      reset({
        brand: rowData.brand,
        model: rowData.model,
        status: rowData.status,
        assigned_to:
        typeof rowData.assigned_to === "string"
          ? rowData.assigned_to
          : rowData.assigned_to?._id ?? null,
      });
    }
  }, [rowData, reset]);

  /* ---------- Fetch available employees ---------- */
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


  /* ---------- Submit ---------- */
  const onSubmit = async (values: AssetFormValues) => {
    try {
      const method = rowData ? "PUT" : "POST";
      const url = rowData
        ? `${apiEndpoint}/${rowData._id}`
        : apiEndpoint;

      const payload = rowData
        ? { ...rowData, ...values }
        : values;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Something went wrong");
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

  /* ---------------- UI ---------------- */

  return (
    <Dialog open onOpenChange={(open) => !open && onClose?.()}>
      <DialogContent className="max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="font-semibold text-purple-800 dark:text-purple-600">
            {title || (rowData ? "Edit Asset" : "Add Asset")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Brand */}
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

            {/* Model */}
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status (edit only) */}
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
                          {STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
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
                      onValueChange={(value) =>
                        field.onChange(value === "" ? null : value)
                      }
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
            />)}

            {/* Footer */}
            <DialogFooter className="flex justify-end gap-2 pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting} variant="asia">
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
      </DialogContent>
    </Dialog>
  );
}
