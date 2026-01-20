"use client";

import { House } from "lucide-react";
import Main from "@/components/Overview/main";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Overview() {
  return (
    <div>
      <div className="flex items-center">
        <h2 className="text-xl font-semibold border-r pr-4">Asset Hub</h2>
        <div className="ml-3">
          <House size={16} />
        </div>
        <span className="text-sm text-gray-500 ml-1.5">- Overview</span>
      </div>

      <Tabs defaultValue="mouse" className="py-5">
        <TabsList className="flex-wrap gap-2">
          <TabsTrigger value="mouse">Mouse</TabsTrigger>
          <TabsTrigger value="keyboard">Keyboard</TabsTrigger>
          <TabsTrigger value="pc">PC</TabsTrigger>
          <TabsTrigger value="laptop">Laptop</TabsTrigger>
          <TabsTrigger value="headset">Headset</TabsTrigger>
          <TabsTrigger value="phone">Phone</TabsTrigger>
        </TabsList>

        <TabsContent value="mouse"><Main assetType="mouse" /></TabsContent>
        <TabsContent value="keyboard"><Main assetType="keyboard" /></TabsContent>
        <TabsContent value="pc"><Main assetType="pc" /></TabsContent>
        <TabsContent value="laptop"><Main assetType="laptop" /></TabsContent>
        <TabsContent value="headset"><Main assetType="heatset" /></TabsContent>
        <TabsContent value="phone"><Main assetType="phone" /></TabsContent>
      </Tabs>
    </div>
  );
}
