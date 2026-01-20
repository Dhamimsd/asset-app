"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { assetColumns } from "./column_ref";
import { IMouse } from "@/lib/model";
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

export default function MousePage() {
  const [data, setData] = useState<IMouse[]>([]);
  const [selectedMouse, setSelectedMouse] = useState<IMouse | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // For delete dialog
  const [mouseToDelete, setMouseToDelete] = useState<IMouse | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch mice on mount
  useEffect(() => {
    fetchMice();
  }, []);

  const fetchMice = async () => {
    try {
      const res = await fetch("/api/mouse", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch");
      const mice: IMouse[] = await res.json();
      setData(mice);
    } catch (err) {
      toast.error("Failed to fetch mice");
      console.error(err);
    }
  };

  // Add / Edit handlers
  const handleAdd = () => {
    setSelectedMouse(null);
    setIsFormOpen(true);
  };

  const handleEdit = (mouse: IMouse) => {
    setSelectedMouse(mouse);
    setIsFormOpen(true);
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (mouse: IMouse) => {
    setMouseToDelete(mouse);
    setIsDeleteDialogOpen(true);
  };

  // Confirm deletion
  const confirmDelete = async () => {
    if (!mouseToDelete) return;

    try {
      const res = await fetch(`/api/mouse/${mouseToDelete._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setData((prev) => prev.filter((m) => m._id !== mouseToDelete._id));
      toast.success("Mouse deleted successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete mouse");
    } finally {
      setIsDeleteDialogOpen(false);
      setMouseToDelete(null);
    }
  };

  // Save handler (Add or Update)
  const handleSave = (mouse: IMouse) => {
    const exists = data.find((m) => m._id === mouse._id);
    if (exists) {
      setData((prev) => prev.map((m) => (m._id === mouse._id ? mouse : m)));
      
    } else {
      setData((prev) => [mouse, ...prev]);
      
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6 py-5">
      {/* Add Mouse Button */}
      <Button onClick={handleAdd} variant="asia" size="sm">
        Add Mouse
      </Button>

      {/* DataTable */}
      <DataTable
        columns={assetColumns(handleEdit, handleDeleteClick)}
        data={data}
        filterBy="_id"
      />

      {/* AssetForm Dialog */}
      {isFormOpen && (
        <AssetForm<IMouse>
          rowData={selectedMouse ?? undefined}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
          apiEndpoint="/api/mouse"
          title={selectedMouse ? "Edit Mouse" : "Add Mouse"}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Mouse</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{mouseToDelete?._id}</span>? This
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
