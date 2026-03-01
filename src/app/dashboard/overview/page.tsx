"use client";

import { useEffect, useState } from "react";
import {
  User,
  Mouse,
  Keyboard,
  Monitor,
  Laptop,
  Headset,
  Phone,
  Computer,
  House,
} from "lucide-react";

import Main from "@/components/Overview/main";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Totals = {
  employees: number;
  mouse: number;
  keyboard: number;
  pc: number;
  laptop: number;
  heatset: number;
  phone: number;
  monitor: number;
};

export default function AssetHubPage() {
  const [totals, setTotals] = useState<Totals | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTotals() {
      setLoading(true);
      try {
        const empRes = await fetch("/api/employee");
        const employees = await empRes.json();

        const assetTypes = [
          "mouse",
          "keyboard",
          "pc",
          "laptop",
          "heatset",
          "phone",
          "monitor",
        ];

        const assetCounts: any = {};

        await Promise.all(
          assetTypes.map(async (type) => {
            const res = await fetch(`/api/assets/${type}`);
            const data = await res.json();
            assetCounts[type] = data.total || 0;
          })
        );

        setTotals({
          employees: employees.length || 0,
          ...assetCounts,
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
        <Spinner className="h-10 w-10 text-purple-600" />
      </div>
    );

  if (!totals) return null;

  const assets = [
    {
      name: "Mouse",
      value: totals.mouse,
      icon: <Mouse size={24} />,
    },
    {
      name: "Keyboard",
      value: totals.keyboard,
      icon: <Keyboard size={24} />,
    },
    {
      name: "PC",
      value: totals.pc,
      icon: <Computer size={24} />,
    },
    {
      name: "Laptop",
      value: totals.laptop,
      icon: <Laptop size={24} />,
    },
    {
      name: "Headset",
      value: totals.heatset,
      icon: <Headset size={24} />,
    },
    {
      name: "Phone",
      value: totals.phone,
      icon: <Phone size={24} />,
    },
    {
      name: "Monitor",
      value: totals.monitor,
      icon: <Monitor size={24} />,
    },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-900 dark:to-neutral-950">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <House className="text-purple-600" size={22} />
        <h1 className="text-2xl font-bold tracking-tight">
          Asset Hub Overview
        </h1>
      </div>

      {/* WELCOME CARD */}
      <Card className="p-8 mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl rounded-2xl">
        <h2 className="text-3xl font-bold">Welcome Back 👋</h2>
        <p className="mt-2 text-purple-100">
          Here’s your real-time company asset summary
        </p>
      </Card>

      {/* STATS GRID */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">

        {/* Employees */}
        <Card className="p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex items-center gap-4 bg-white dark:bg-neutral-800">
          <User size={28} className="text-purple-600" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Employees
            </p>
            <h3 className="text-2xl font-bold">
              {totals.employees}
            </h3>
          </div>
        </Card>

        {/* Assets */}
        {assets.map((asset) => (
          <Card
            key={asset.name}
            className="p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 bg-white dark:bg-neutral-800"
          >
            <div className="text-indigo-600 dark:text-indigo-400">
              {asset.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {asset.name}
              </p>
              <h3 className="text-2xl font-bold">
                {asset.value}
              </h3>
            </div>
          </Card>
        ))}
      </div>

      {/* TABS SECTION */}
      <Card className="p-6 rounded-2xl shadow-lg bg-white dark:bg-neutral-800">
        <Tabs defaultValue="mouse" className="w-full">

          <TabsList className="flex flex-wrap gap-2 mb-6 sm:mb-8">
            <TabsTrigger value="mouse">Mouse</TabsTrigger>
            <TabsTrigger value="keyboard">Keyboard</TabsTrigger>
            <TabsTrigger value="pc">PC</TabsTrigger>
            <TabsTrigger value="laptop">Laptop</TabsTrigger>
            <TabsTrigger value="heatset">Headset</TabsTrigger>
            <TabsTrigger value="phone">Phone</TabsTrigger>
            <TabsTrigger value="monitor">Monitor</TabsTrigger>
          </TabsList>

          <TabsContent value="mouse">
            <Main assetType="mouse" />
          </TabsContent>

          <TabsContent value="keyboard">
            <Main assetType="keyboard" />
          </TabsContent>

          <TabsContent value="pc">
            <Main assetType="pc" />
          </TabsContent>

          <TabsContent value="laptop">
            <Main assetType="laptop" />
          </TabsContent>

          <TabsContent value="heatset">
            <Main assetType="heatset" />
          </TabsContent>

          <TabsContent value="phone">
            <Main assetType="phone" />
          </TabsContent>

          <TabsContent value="monitor">
            <Main assetType="monitor" />
          </TabsContent>

        </Tabs>
      </Card>

    </div>
  );
}