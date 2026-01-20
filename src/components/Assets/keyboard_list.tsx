"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { assetColumns } from "./column_ref";
import { IKeyboard } from "@/lib/model";
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

export default function KeyboardPage() {
  const [data, setData] = useState<IKeyboard[]>([]);
  const [selectedKeyboard, setSelectedKeyboard] = useState<IKeyboard | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // For delete dialog
  const [keyboardToDelete, setKeyboardToDelete] = useState<IKeyboard | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch keyboards on mount
  useEffect(() => {
    fetchKeyboards();
  }, []);

  const fetchKeyboards = async () => {
    try {
      const res = await fetch("/api/keyboard", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch");
      const keyboards: IKeyboard[] = await res.json();
      setData(keyboards);
    } catch (err) {
      toast.error("Failed to fetch keyboards");
      console.error(err);
    }
  };

  // Add / Edit handlers
  const handleAdd = () => {
    setSelectedKeyboard(null);
    setIsFormOpen(true);
  };

  const handleEdit = (keyboard: IKeyboard) => {
    setSelectedKeyboard(keyboard);
    setIsFormOpen(true);
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (keyboard: IKeyboard) => {
    setKeyboardToDelete(keyboard);
    setIsDeleteDialogOpen(true);
  };

  // Confirm deletion
  const confirmDelete = async () => {
    if (!keyboardToDelete) return;

    try {
      const res = await fetch(`/api/keyboard/${keyboardToDelete._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setData((prev) => prev.filter((k) => k._id !== keyboardToDelete._id));
      toast.success("Mouse deleted successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete mouse");
    } finally {
      setIsDeleteDialogOpen(false);
      setKeyboardToDelete(null);
    }
  };

  // Save handler (Add or Update)
  const handleSave = (keyboard: IKeyboard) => {
    const exists = data.find((k) => k._id === keyboard._id);
    if (exists) {
      setData((prev) => prev.map((k) => (k._id === keyboard._id ? keyboard : k)));
      
    } else {
      setData((prev) => [keyboard, ...prev]);
      
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6 py-5">
      {/* Add Mouse Button */}
      <Button onClick={handleAdd} variant="asia" size="sm">
        Add Keyboard
      </Button>

      {/* DataTable */}
      <DataTable
        columns={assetColumns(handleEdit, handleDeleteClick)}
        data={data}
        filterBy="_id"
      />

      {/* AssetForm Dialog */}
      {isFormOpen && (
        <AssetForm<IKeyboard>
          rowData={selectedKeyboard ?? undefined}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
          apiEndpoint="/api/keyboard"
          title={selectedKeyboard ? "Edit Keyboard" : "Add Keyboard"}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Keyboard</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{keyboardToDelete?._id}</span>? This
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
