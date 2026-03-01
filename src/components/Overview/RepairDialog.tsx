"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type RepairAsset = {
  id: string;
  name: string;
  updatedAt?: string;
  assigned_to?: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  assets?: RepairAsset[]; // make optional
};

export default function RepairDialog({
  open,
  onClose,
  assets = [], // default empty array
}: Props) {

  // Ensure it's always an array
  const safeAssets = Array.isArray(assets) ? assets : [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Assets Under Repair</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {safeAssets.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No assets in repair.
            </p>
          )}

          {safeAssets.map((asset) => (
            <div
              key={asset.id}
              className="flex items-center justify-between border p-3 rounded-md"
            >
              <div>
                <p className="font-medium">Employee ID : {asset.assigned_to}</p>
                <p className="text-xs text-muted-foreground">
                  ID: {asset.id}
                </p>
              </div>

              <p className="text-sm text-muted-foreground">
                {asset.updatedAt
                  ? new Date(asset.updatedAt).toLocaleDateString()
                  : "—"}
              </p>
            </div>
          ))}
        </div>

        <Button
          onClick={onClose}
          className="mt-4 w-full"
          variant="secondary"
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}