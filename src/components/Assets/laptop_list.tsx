"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { assetColumns } from "./column_ref";
import { ILaptop } from "@/lib/model";
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

export default function LaptopPage() {
  const [data, setData] = useState<ILaptop[]>([]);
  const [selectedLaptop, setSelectedLaptop] = useState<ILaptop | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // For delete dialog
  const [laptopToDelete, setLaptopToDelete] = useState<ILaptop | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch laptops on mount
  useEffect(() => {
    fetchLaptops();
  }, []);

  const fetchLaptops = async () => {
    try {
      const res = await fetch("/api/laptop", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch");
      const laptops: ILaptop[] = await res.json();
      setData(laptops);
    } catch (err) {
      toast.error("Failed to fetch laptops");
      console.error(err);
    }
  };

  // Add / Edit handlers
  const handleAdd = () => {
    setSelectedLaptop(null);
    setIsFormOpen(true);
  };

  const handleEdit = (laptop: ILaptop) => {
    setSelectedLaptop(laptop);
    setIsFormOpen(true);
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (laptop: ILaptop) => {
    setLaptopToDelete(laptop);
    setIsDeleteDialogOpen(true);
  };

  // Confirm deletion
  const confirmDelete = async () => {
    if (!laptopToDelete) return;

    try {
      const res = await fetch(`/api/laptop/${laptopToDelete._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setData((prev) => prev.filter((m) => m._id !== laptopToDelete._id));
      toast.success("Laptop deleted successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete laptop");
    } finally {
      setIsDeleteDialogOpen(false);
      setLaptopToDelete(null);
    }
  };

  // Save handler (Add or Update)
  const handleSave = (laptop: ILaptop) => {
    const exists = data.find((m) => m._id === laptop._id);
    if (exists) {
      setData((prev) => prev.map((m) => (m._id === laptop._id ? laptop : m)));
      
    } else {
      setData((prev) => [laptop, ...prev]);
      
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6 py-5">
      {/* Add Laptop Button */}
      <Button onClick={handleAdd} variant="asia" size="sm">
        Add Laptop
      </Button>

      {/* DataTable */}
      <DataTable
        columns={assetColumns(handleEdit, handleDeleteClick)}
        data={data}
        filterBy="_id"
      />

      {/* AssetForm Dialog */}
      {isFormOpen && (
        <AssetForm<ILaptop>
          rowData={selectedLaptop ?? undefined}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
          apiEndpoint="/api/laptop"
          title={selectedLaptop ? "Edit Laptop" : "Add Laptop"}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Laptop</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{laptopToDelete?._id}</span>? This
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
