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
import { IEmployee, IMouse, IKeyboard, IPc ,IHeatset,ILaptop,IPhone} from "@/lib/model";
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

/* -------------------- TYPES -------------------- */

type EmployeeFormValues = {
  employee_name: string;
  department: string;
  keyboard_id?: string;
  mouse_id?: string;
  pc_id?: string;
  heatset_id?: string;
  laptop_id?: string;
  phone_id?: string;
  status: string;
};

type EmployeeFormProps = {
  rowData?: IEmployee;
  onClose?: () => void;
  onSave: (data: IEmployee) => void;
};

type AssetType = "mouse" | "keyboard" | "pc" | "heatset" | "laptop"|"phone";

const STATUSES = ["ACTIVE", "INACTIVE"];

/* -------------------- HELPERS -------------------- */

function useAvailableAssets<T>(asset: string) {
  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await fetch(`/api/${asset}?status=STORE`);
        if (!res.ok) throw new Error();
        setData(await res.json());
      } catch {
        toast.error(`Failed to fetch ${asset}`);
      }
    };
    fetchAssets();
  }, [asset]);

  return data;
}

async function updateAssetAssignment(
  assetType: AssetType,
  oldId: string | undefined,
  newId: string | undefined,
  employeeId: string
) {
  if (oldId && oldId !== newId) {
    await fetch(`/api/${assetType}/${oldId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "STORE", assigned_to: null }),
    });
  }

  if (newId) {
    await fetch(`/api/${assetType}/${newId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "USED", assigned_to: employeeId }),
    });
  }
}

/* -------------------- COMPONENT -------------------- */

export default function EmployeeForm({
  rowData,
  onClose,
  onSave,
}: EmployeeFormProps) {
  const availableMice = useAvailableAssets<IMouse>("mouse");
  const availableKeyboards = useAvailableAssets<IKeyboard>("keyboard");
  const availablePcs = useAvailableAssets<IPc>("pc");
  const availableheatsets = useAvailableAssets<IHeatset>("heatset");
  const availableLaptops = useAvailableAssets<ILaptop>("laptop");
  const availablePhones = useAvailableAssets<IPhone>("phone");

  const form = useForm<EmployeeFormValues>({
    defaultValues: {
      employee_name: rowData?.employee_name || "",
      department: rowData?.department || "",
      keyboard_id: rowData?.keyboard_id || "",
      mouse_id: rowData?.mouse_id || "",
      pc_id: rowData?.pc_id || "",
      heatset_id: rowData?.heatset_id || "",
      laptop_id: rowData?.laptop_id || "",
      phone_id: rowData?.phone_id || "",
      status: rowData?.status || STATUSES[0],
    },
  });

  const { handleSubmit, reset, formState } = form;

  useEffect(() => {
    if (rowData) {
      reset({
        employee_name: rowData.employee_name,
        department: rowData.department,
        keyboard_id: rowData.keyboard_id || "",
        mouse_id: rowData.mouse_id || "",
        pc_id: rowData.pc_id || "",
        heatset_id: rowData.heatset_id || "",
        laptop_id: rowData.laptop_id || "",
        status: rowData.status,
      });
    }
  }, [rowData, reset]);

  const onSubmit = async (values: EmployeeFormValues) => {
    try {
      const payload: any = { ...values };
      ["keyboard_id", "mouse_id", "pc_id", "heatset_id", "laptop_id", "phone_id"].forEach(
        (k) => !payload[k] && delete payload[k]
      );

      const res = await fetch(
        rowData ? `/api/employee/${rowData._id}` : "/api/employee",
        {
          method: rowData ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed to save employee");
      const employee = await res.json();

      await Promise.all([
        updateAssetAssignment("mouse", rowData?.mouse_id, values.mouse_id, employee._id),
        updateAssetAssignment("keyboard", rowData?.keyboard_id, values.keyboard_id, employee._id),
        updateAssetAssignment("pc", rowData?.pc_id, values.pc_id, employee._id),
        updateAssetAssignment("heatset", rowData?.heatset_id, values.heatset_id, employee._id),
        updateAssetAssignment("laptop", rowData?.laptop_id, values.laptop_id, employee._id),
        updateAssetAssignment("phone", rowData?.phone_id, values.phone_id, employee._id),
      ]);

      onSave(employee);
      reset();
      onClose?.();
      toast.success(rowData ? "Employee updated" : "Employee added");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose?.()}>
      <DialogContent className="max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {rowData ? "Edit Employee" : "Add Employee"}
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[70vh] px-2">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {["employee_name", "department"].map((name) => (
              <FormField
                key={name}
                control={form.control}
                name={name as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{name.replace("_", " ")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            {/* Mouse */}
            <FormField
              control={form.control}
              name="mouse_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mouse</FormLabel>
                  <FormControl>
                    <Select value={field.value || ""} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Mouse" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableMice.map((m) => (
                          <SelectItem key={m._id} value={m._id}>
                            {m._id} - {m.brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Keyboard */}
            <FormField
              control={form.control}
              name="keyboard_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keyboard</FormLabel>
                  <FormControl>
                    <Select value={field.value || ""} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Keyboard" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableKeyboards.map((k) => (
                          <SelectItem key={k._id} value={k._id}>
                            {k._id} - {k.brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* PC */}
            <FormField
              control={form.control}
              name="pc_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PC</FormLabel>
                  <FormControl>
                    <Select value={field.value || ""} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select PC" />
                      </SelectTrigger>
                      <SelectContent>
                        {availablePcs.map((p) => (
                          <SelectItem key={p._id} value={p._id}>
                            {p._id} - {p.brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* heatset */}
            <FormField
              control={form.control}
              name="heatset_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>heatset</FormLabel>
                  <FormControl>
                    <Select value={field.value || ""} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select heatset" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableheatsets.map((h) => (
                          <SelectItem key={h._id} value={h._id}>
                            {h._id} - {h.brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Laptop */}
            <FormField
              control={form.control}
              name="laptop_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Laptop</FormLabel>
                  <FormControl>
                    <Select value={field.value || ""} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Laptop" />
                      </SelectTrigger>
                       <SelectContent>
                        {availableLaptops.map((l) => (
                          <SelectItem key={l._id} value={l._id}>
                            {l._id} - {l.brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Select value={field.value || ""} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Phone" />
                      </SelectTrigger>
                      <SelectContent>
                        {availablePhones.map((pn) => (
                          <SelectItem key={pn._id} value={pn._id}>
                            {pn._id} - {pn.brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

           <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
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
                </FormItem>
              )}
            />  

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={formState.isSubmitting} variant="asia">
                {formState.isSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </div>
    </DialogContent>
    </Dialog >
  );
}
