"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { assetColumns } from "./column_ref";
import { IPhone } from "@/lib/model";
import { Button } from "../ui/button";
import AssetForm from "./asset_form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";

export default function PhonePage() {
  const [data, setData] = useState<IPhone[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<IPhone | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // For delete dialog
  const [phoneToDelete, setPhoneToDelete] = useState<IPhone | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch phones on mount
  useEffect(() => {
    fetchPhones();
  }, []);

  const fetchPhones = async () => {
    try {
      const res = await fetch("/api/phone", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch");
      const phones: IPhone[] = await res.json();
      setData(phones);
    } catch (err) {
      toast.error("Failed to fetch pcs");
      console.error(err);
    }
  };

  // Add / Edit handlers
  const handleAdd = () => {
    setSelectedPhone(null);
    setIsFormOpen(true);
  };

  const handleEdit = (phone: IPhone) => {
    setSelectedPhone(phone);
    setIsFormOpen(true);
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (phone: IPhone) => {
    setPhoneToDelete(phone);
    setIsDeleteDialogOpen(true);
  };

  // Confirm deletion
  const confirmDelete = async () => {
    if (!phoneToDelete) return;

    try {
      const res = await fetch(`/api/phone/${phoneToDelete._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setData((prev) => prev.filter((m) => m._id !== phoneToDelete._id));
      toast.success("Phone deleted successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete Phone");
      setData((prev) => prev.filter((m) => m._id !== phoneToDelete._id));
      toast.success("Phone deleted successfully");
    } finally {
      setIsDeleteDialogOpen(false);
      setPhoneToDelete(null);
    }
  };

  // Save handler (Add or Update)
  const handleSave = (phone: IPhone) => {
    const exists = data.find((m) => m._id === phone._id);
    if (exists) {
      setData((prev) => prev.map((m) => (m._id === phone._id ? phone : m)));
      
    } else {
      setData((prev) => [phone, ...prev]);
      
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6 py-5">
      {/* Add Laptop Button */}
      <Button onClick={handleAdd} variant="asia" size="sm">
        Add Phone
      </Button>

      {/* DataTable */}
      <DataTable
        columns={assetColumns(handleEdit, handleDeleteClick)}
        data={data}
        filterBy="_id"
      />

      {/* AssetForm Dialog */}
      {isFormOpen && (
        <AssetForm<IPhone>
          rowData={selectedPhone ?? undefined}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
          apiEndpoint="/api/phone"
          title={selectedPhone ? "Edit Phone" : "Add Phone"}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Phone</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{phoneToDelete?._id}</span>? This
              action cannot be undone.
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
