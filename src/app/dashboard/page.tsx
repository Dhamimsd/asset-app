"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { User, Mouse, Keyboard, Monitor, Laptop, Headset, Phone,Computer} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

type Totals = {
  employees: number;
  mice: number;
  keyboards: number;
  pcs: number;
  laptops: number;
  headsets: number;
  phones: number;
  monitors: number;
};

export default function DashboardPage() {
  const [totals, setTotals] = useState<Totals | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTotals() {
      setLoading(true);
      try {
        // Fetch employees count
        const empRes = await fetch("/api/employee");
        const employees = await empRes.json();

        // Fetch assets counts for each type
        const assetTypes = ["mouse", "keyboard", "pc", "laptop", "headset", "phone", "monitor"];
        const assetCounts: any = {};

        await Promise.all(
          assetTypes.map(async (type) => {
            const res = await fetch(`/api/assets/${type}`);
            const data = await res.json();
            assetCounts[type + "s"] = data.total || 0;
          })
        );

        setTotals({
          employees: employees.length || 0,
          mice: assetCounts.mouses || 0,
          keyboards: assetCounts.keyboards || 0,
          pcs: assetCounts.pcs || 0,
          laptops: assetCounts.laptops || 0,
          headsets: assetCounts.headsets || 0,
          phones: assetCounts.phones || 0,
          monitors: assetCounts.monitors || 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchTotals();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="h-10 w-10 text-purple-800 dark:text-purple-600" />
      </div>
    );

  if (!totals) return null;

  const assets = [
    { name: "Mice", icon: <Mouse size={28} className="text-blue-600 dark:text-blue-400" />, count: totals.mice },
    { name: "Keyboards", icon: <Keyboard size={28} className="text-green-600 dark:text-green-400" />, count: totals.keyboards },
    { name: "PCs", icon: <Computer size={28} className="text-purple-600 dark:text-purple-400" />, count: totals.pcs },
    { name: "Laptops", icon: <Laptop size={28} className="text-yellow-600 dark:text-yellow-400" />, count: totals.laptops },
    { name: "Headsets", icon: <Headset size={28} className="text-red-600 dark:text-red-400" />, count: totals.headsets },
    { name: "Phones", icon: <Phone size={28} className="text-orange-600 dark:text-orange-400" />, count: totals.phones },
    { name: "Monitors", icon: <Monitor size={28} className="text-indigo-600 dark:text-indigo-400" />, count: totals.monitors },
  ];

  return (
    <div className="p-6 bg-gray-50 dark:bg-neutral-900 min-h-screen">
      {/* Welcome Card */}
      <Card className="p-8 mb-6 bg-purple-100 dark:bg-purple-900 shadow-lg rounded-xl">
        <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-200">
          Welcome Back!
        </h1>
        <p className="mt-2 text-lg text-purple-700 dark:text-purple-300">
          Quick overview of your employees and assets
        </p>
      </Card>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Employees Card */}
        <Card className="p-5 flex items-center gap-4 shadow-md hover:shadow-xl transition">
          <User size={32} className="text-purple-800 dark:text-purple-200" />
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Employees</h3>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{totals.employees}</p>
          </div>
        </Card>

        {/* Asset Cards */}
        {assets.map((asset) => (
          <Card
            key={asset.name}
            className="p-5 flex items-center gap-4 shadow-md hover:shadow-xl transition cursor-pointer"
          >
            {asset.icon}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{asset.name}</h3>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{asset.count}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
