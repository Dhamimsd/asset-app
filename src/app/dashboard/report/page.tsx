"use client";

import { useEffect, useState } from "react";
import { IEmployee } from "@/lib/model";

export default function EmployeeReportPage() {
  const [data, setData] = useState<IEmployee[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const res = await fetch("/api/employee", { cache: "no-store" });
      const employees = await res.json();
      setData(employees);

      // auto print once loaded
      setTimeout(() => window.print(), 500);
    };

    fetchEmployees();
  }, []);

  return (
    <div className="p-10 text-black">
      <h1 className="text-2xl font-bold text-center mb-6">
        Employee Report
      </h1>

      <table className="w-full border border-collapse text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">#</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Department</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Type</th>
          </tr>
        </thead>

        <tbody>
          {data.map((e, i) => (
            <tr key={e._id}>
              <td className="border p-2">{i + 1}</td>
              <td className="border p-2">{e.employee_name}</td>
              <td className="border p-2">{e.department}</td>
              <td className="border p-2">{e.status}</td>
              <td className="border p-2">{e.employment_type}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Print-only footer */}
      <div className="mt-10 text-xs text-right">
        Generated on: {new Date().toLocaleString()}
      </div>
    </div>
  );
}
