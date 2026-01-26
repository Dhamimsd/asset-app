"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { employeeColumns } from "./column_ref";
import { IEmployee } from "@/lib/model";
import { Button } from "../ui/button";
import EmployeeForm from "./employee_form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { downloadEmployeePDF } from "@/lib/employeePdf";

export default function EmployeesPage() {
  const [data, setData] = useState<IEmployee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<IEmployee | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [employeeToDelete, setEmployeeToDelete] = useState<IEmployee | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/employee", { cache: "no-store" });
      const employees: IEmployee[] = await res.json();
      setData(employees);
    } catch {
      toast.error("Failed to fetch employees");
    }
  };

  const handleAdd = () => {
    setSelectedEmployee(null);
    setIsFormOpen(true);
  };

  const handleEdit = (employee: IEmployee) => {
    setSelectedEmployee(employee);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (employee: IEmployee) => {
    setEmployeeToDelete(employee);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;

    try {
      const res = await fetch(`/api/employee/${employeeToDelete._id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      setData((prev) => prev.filter((e) => e._id !== employeeToDelete._id));
      toast.success("Employee deleted successfully");
    } catch {
      toast.error("Failed to delete employee");
    } finally {
      setIsDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const handleSave = (employee: IEmployee) => {
    setData((prev) => {
      const exists = prev.find((e) => e._id === employee._id);
      return exists
        ? prev.map((e) => (e._id === employee._id ? employee : e))
        : [employee, ...prev];
    });
    setIsFormOpen(false);
  };

  const handleDownloadReport = () => {
  if (!data.length) {
    toast.error("No employee data to export");
    return;
  }

  downloadEmployeePDF(data);
};
  return (
    <div className="space-y-6 py-5">
      <Button onClick={handleDownloadReport} variant="outline" size="sm">
  Download Employee PDF
</Button>

      <Button onClick={handleAdd} variant="asia" size="sm">
        Add Employee
      </Button>

      <DataTable
        columns={employeeColumns(handleEdit, handleDeleteClick)}
        data={data}
        filterBy="employee_name"
      />

      {isFormOpen && (
        <EmployeeForm
          rowData={selectedEmployee ?? undefined}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
        />
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "
              {employeeToDelete?.employee_name}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
