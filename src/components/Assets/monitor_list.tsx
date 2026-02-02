"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { assetColumns } from "./column_ref";
import { IMonitor } from "@/lib/model";
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

export default function MonitorPage() {
  const [data, setData] = useState<IMonitor[]>([]);
  const [selectedMonitor, setSelectedMonitor] = useState<IMonitor | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // For delete dialog
  const [monitorToDelete, setMonitorToDelete] = useState<IMonitor | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch monitors on mount
  useEffect(() => {
    fetchMonitors();
  }, []);

  const fetchMonitors = async () => {
    try {
      const res = await fetch("/api/monitor", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch");
      const monitors: IMonitor[] = await res.json();
      setData(monitors);
    } catch (err) {
      toast.error("Failed to fetch monitors");
      console.error(err);
    }
  };

  // Add / Edit handlers
  const handleAdd = () => {
    setSelectedMonitor(null);
    setIsFormOpen(true);
  };

  const handleEdit = (monitor: IMonitor) => {
    setSelectedMonitor(monitor);
    setIsFormOpen(true);
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (monitor: IMonitor) => {
    setMonitorToDelete(monitor);
    setIsDeleteDialogOpen(true);
  };

  // Confirm deletion
  const confirmDelete = async () => {
    if (!monitorToDelete) return;

    try {
      const res = await fetch(`/api/monitor/${monitorToDelete._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setData((prev) => prev.filter((m) => m._id !== monitorToDelete._id));
      toast.success("Monitor deleted successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete monitor");
    } finally {
      setIsDeleteDialogOpen(false);
      setMonitorToDelete(null);
    }
  };

  // Save handler (Add or Update)
  const handleSave = (monitor: IMonitor) => {
    const exists = data.find((m) => m._id === monitor._id);
    if (exists) {
      setData((prev) => prev.map((m) => (m._id === monitor._id ? monitor : m)));
      
    } else {
      setData((prev) => [monitor, ...prev]);
      
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6 py-5">
      {/* Add Monitor Button */}
      <Button onClick={handleAdd} variant="asia" size="sm">
        Add Monitor
      </Button>

      {/* DataTable */}
      <DataTable
        columns={assetColumns(handleEdit, handleDeleteClick)}
        data={data}
        filterBy="_id"
      />

      {/* AssetForm Dialog */}
     {isFormOpen && (
             <AssetForm<IMonitor>
               rowData={selectedMonitor ?? undefined}
               onClose={() => setIsFormOpen(false)}
               onSave={handleSave}
               apiEndpoint="/api/monitor"
               assetType="monitor"
               title={selectedMonitor ? "Edit Monitor" : "Add Monitor"}
             />
     
           )}
     

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Monitor</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{monitorToDelete?._id}</span>? This
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
