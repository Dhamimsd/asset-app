"use client";

type StatusDotProps = {
  status?: string;
  size?: number;
};

export default function StatusDot({ status = "STORE", size = 10 }: StatusDotProps) {
  const colorMap: Record<string, string> = {
    USED: "bg-green-500",
    REPAIR: "bg-red-500",
    STORE: "bg-gray-400",
  };

  return (
    <span
      className={`inline-block rounded-full ${colorMap[status] || "bg-gray-300"}`}
      style={{ width: size, height: size }}
      title={status}
    />
  );
}
