"use client";

import { useEffect, useState } from "react";
import AssetStats from "./AssetStats";
import {Spinner} from "@/components/ui/spinner";

type Stats = {
  total: number;
  store: number;
  used: number;
  repair: number;
};

export default function Main({ assetType }: { assetType: string }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      const res = await fetch(`/api/assets/${assetType}`);
      const data = await res.json();
      setStats(data);
      setLoading(false);
    }

    fetchStats();
  }, [assetType]);

  if (loading)
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Spinner className="h-10 w-10 text-purple-800 dark:text-purple-600" />
    </div>
  );

  if (!stats) return null;

  return (
    <AssetStats
      total={stats.total}
      store={stats.store}
      used={stats.used}
      repair={stats.repair}
    />
  );
}
