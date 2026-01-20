"use client";

import Assets from "@/components/Assets/laptop_list";
import { House } from "lucide-react";


export default function Page() {
  return (
    <>
    <div className="flex justify-between items-center">
        <div className="flex items-center py-3">
          <h2 className="text-xl font-semibold pr-4 border-r">Asset Hub</h2>
          <div className="ml-3">
            <House size="16" className="text-zinc-800 dark:text-zinc-200" />
          </div>
          <h2 className="text-sm pl-1.5 text-gray-500 dark:text-gray-400 font-small">
            - Laptop Assets
          </h2>
        </div>
      </div>
       <Assets />
      
    </>
  );
}



