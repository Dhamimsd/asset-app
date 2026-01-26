"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { assetColumns } from "./column_ref1";
import { IPc } from "@/lib/model";
import { Button } from "../ui/button";
import AssetForm from "./asset_form1";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";

export default function PcPage() {
  const [data, setData] = useState<IPc[]>([]);
  const [selectedPc, setSelectedPc] = useState<IPc | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // For delete dialog
  const [pcToDelete, setPcToDelete] = useState<IPc | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch pcs on mount
  useEffect(() => {
    fetchPcs();
  }, []);

  const fetchPcs = async () => {
    try {
      const res = await fetch("/api/pc", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch");
      const pcs: IPc[] = await res.json();
      setData(pcs);
    } catch (err) {
      toast.error("Failed to fetch pcs");
      console.error(err);
    }
  };

  // Add / Edit handlers
  const handleAdd = () => {
    setSelectedPc(null);
    setIsFormOpen(true);
  };

  const handleEdit = (pc: IPc) => {
    setSelectedPc(pc);
    setIsFormOpen(true);
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (pc: IPc) => {
    setPcToDelete(pc);
    setIsDeleteDialogOpen(true);
  };

  // Confirm deletion
  const confirmDelete = async () => {
    if (!pcToDelete) return;

    try {
      const res = await fetch(`/api/pc/${pcToDelete._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setData((prev) => prev.filter((m) => m._id !== pcToDelete._id));
      toast.success("PC deleted successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete PC");
      setData((prev) => prev.filter((m) => m._id !== pcToDelete._id));
      toast.success("PC deleted successfully");
    } finally {
      setIsDeleteDialogOpen(false);
      setPcToDelete(null);
    }
  };

  // Save handler (Add or Update)
  const handleSave = (pc: IPc) => {
    const exists = data.find((m) => m._id === pc._id);
    if (exists) {
      setData((prev) => prev.map((m) => (m._id === pc._id ? pc : m)));
      
    } else {
      setData((prev) => [pc, ...prev]);
      
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6 py-5">
      {/* Add Laptop Button */}
      <Button onClick={handleAdd} variant="asia" size="sm">
        Add Pc
      </Button>

      {/* DataTable */}
      <DataTable
        columns={assetColumns(handleEdit, handleDeleteClick)}
        data={data}
        filterBy="_id"
      />

      {/* AssetForm Dialog */}
      {isFormOpen && (
        <AssetForm<IPc>
          rowData={selectedPc ?? undefined}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
          apiEndpoint="/api/pc"
          title={selectedPc ? "Edit PC" : "Add PC"}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Laptop</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{pcToDelete?._id}</span>? This
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
