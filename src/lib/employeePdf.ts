import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { IEmployee } from "@/lib/model";

export const downloadEmployeePDF = (employees: IEmployee[]) => {
  const doc = new jsPDF("p", "mm", "a4");

  // Title
  doc.setFontSize(16);
  doc.text("Employee Report", 105, 15, { align: "center" });

  // Date (Sri Lanka time)
  doc.setFontSize(10);
  doc.text(
    `Generated on: ${new Date().toLocaleString("en-LK", {
      timeZone: "Asia/Colombo",
    })}`,
    14,
    25
  );

  autoTable(doc, {
    startY: 30,
    head: [["#", "Name", "Department", "Status", "Type","Mouse Id","Keyboard Id","PC Id","Headset Id","Laptop Id","Phone Id","Monitor Id"]],
    body: employees.map((e, i) => [
      i + 1,
      e.employee_name || "—",
      e.department || "—",
      e.status || "—",
      e.employment_type || "—",
      e.mouse_id || "—",
      e.keyboard_id || "—",
      e.pc_id || "—",
      e.heatset_id || "—",
      e.laptop_id || "—",
      e.phone_id || "—",
      e.monitor_id || "—",
    ]),
    styles: {
      fontSize: 9,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
    },
  });

  doc.save("employee-report.pdf");
};
