"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { SheetContent } from "../ui/sheet-content";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { toast } from "sonner";

interface HistoryItem {
  employee: {
    employee_name: string;
  } | null;
  assigned_at: string;
}

type PhoneDetailsProps = {
  _id: string; // phone_id like "PN-0002"
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function PhoneDetails({
  _id,
  open,
  onOpenChange,
}: PhoneDetailsProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !_id) return;

    const fetchHistory = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/history/${_id}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error?.error || "Failed to fetch history");
        }

        const data = await res.json();

        setHistory(data);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Failed to fetch history");
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [_id, open]);

  const formatSriLankaDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Intl.DateTimeFormat("en-LK", {
      timeZone: "Asia/Colombo",
      year: "numeric",
      month: "long",
      day: "2-digit",
    }).format(new Date(dateString));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md border-gray-900"
      >
        <SheetHeader>
          <SheetTitle>Phone History</SheetTitle>
          <SheetDescription>
            Assignment history for {_id}
          </SheetDescription>
        </SheetHeader>

        {loading ? (
          <Skeleton className="h-64 w-full mt-6 rounded-xl" />
        ) : (
          <div className="mt-6 border rounded-2xl border-gray-200 dark:border-neutral-800 p-6 shadow-sm bg-white dark:bg-neutral-900 space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 ring-2 ring-gray-200 dark:ring-neutral-800">
                <AvatarFallback>
                  {_id?.charAt(0).toUpperCase() || "P"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">{_id}</p>
              </div>
            </div>

            <hr className="my-2 dark:border-neutral-800" />
            <h3 className="font-semibold text-md">
              Assignment History
            </h3>

            {history.length > 0 ? (
              <ul className="space-y-2 text-sm max-h-64 overflow-y-auto">
                {history.map((h, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between border rounded p-2 bg-gray-50 dark:bg-neutral-800"
                  >
                    <span>
                      {h.employee?.employee_name || "Unknown"}
                    </span>
                    <span>
                      {formatSriLankaDate(h.assigned_at)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-gray-500 text-sm">
                No assignment history available
              </span>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}