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
  assets: RepairAsset[];
};

export default function RepairDialog({
  open,
  onClose,
  assets,
}: Props) {
  console.log("Dialog open:", open);
  console.log("Repair assets:", assets);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Assets Under Repair</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {assets.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No assets in repair.
            </p>
          )}

          {assets.map(asset => (
            <div
              key={asset.id}
              className="flex items-center justify-between border p-3 rounded-md"
            >
              <div>
                <p className="font-medium">{asset.name}</p>
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
          variant="asiasecondary"
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
