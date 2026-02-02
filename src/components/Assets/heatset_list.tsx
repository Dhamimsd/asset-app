"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { assetColumns } from "./column_ref";
import { IHeatset } from "@/lib/model";
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

export default function HeatsetPage() {
  const [data, setData] = useState<IHeatset[]>([]);
  const [selectedHeatset, setSelectedHeatset] = useState<IHeatset | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // For delete dialog
  const [heatsetToDelete, setHeatsetToDelete] = useState<IHeatset | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch heatsets on mount
  useEffect(() => {
    fetchHeatsets();
  }, []);

  const fetchHeatsets = async () => {
    try {
      const res = await fetch("/api/heatset", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch");
      const heatsets: IHeatset[] = await res.json();
      setData(heatsets);
    } catch (err) {
      toast.error("Failed to fetch heatsets");
      console.error(err);
    }
  };

  // Add / Edit handlers
  const handleAdd = () => {
    setSelectedHeatset(null);
    setIsFormOpen(true);
  };

  const handleEdit = (heatset: IHeatset) => {
    setSelectedHeatset(heatset);
    setIsFormOpen(true);
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (heatset: IHeatset) => {
    setHeatsetToDelete(heatset);
    setIsDeleteDialogOpen(true);
  };

  // Confirm deletion
  const confirmDelete = async () => {
    if (!heatsetToDelete) return;

    try {
      const res = await fetch(`/api/heatset/${heatsetToDelete._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setData((prev) => prev.filter((m) => m._id !== heatsetToDelete._id));
      toast.success("Heatset deleted successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete heatset");
    } finally {
      setIsDeleteDialogOpen(false);
      setHeatsetToDelete(null);
    }
  };

  // Save handler (Add or Update)
  const handleSave = (heatset: IHeatset) => {
    const exists = data.find((m) => m._id === heatset._id);
    if (exists) {
      setData((prev) => prev.map((m) => (m._id === heatset._id ? heatset : m)));

    } else {
      setData((prev) => [heatset, ...prev]);

    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6 py-5">
      {/* Add Heatset Button */}
      <Button onClick={handleAdd} variant="asia" size="sm">
        Add Heatset
      </Button>

      {/* DataTable */}
      <DataTable
        columns={assetColumns(handleEdit, handleDeleteClick)}
        data={data}
        filterBy="_id"
      />

      {/* AssetForm Dialog */}
      {isFormOpen && (
        <AssetForm<IHeatset>
          rowData={selectedHeatset ?? undefined}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
          apiEndpoint="/api/heatset"
          assetType="heatset"
          title={selectedHeatset ? "Edit Heatset" : "Add Heatset"}
        />

      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Heatset</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{heatsetToDelete?._id}</span>? This
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
