"use client";

import { House } from "lucide-react";
import Main from "@/components/employee/main";

export default function Overview() {

  return (
    <div>
      <div className="flex items-center">
        <h2 className="text-xl font-semibold border-r pr-4">
          Asset Hub
        </h2>

        <div className="ml-3">
          <House size={16} className="text-zinc-800 dark:text-zinc-200" />
        </div>

        <span className="text-sm text-gray-500 dark:text-gray-400 ml-1.5">
          - Employees
        </span>
      </div>

          
          <Main />
   
    </div>
  );
}
