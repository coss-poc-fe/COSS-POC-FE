'use client';

import LatencyAdminTable, { LatencyData } from "@/components/LatencyAdminTable";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  // Sample data
  const sampleData: LatencyData[] = [
    {
      requestId: "REQ001",
      timestamp: "2025-08-24 10:30:00",
      customerName: "John Doe",
      langDetection: "120ms",
      nmt: "250ms",
      llm: "300ms",
      tts: "150ms",
      overallLatency: "820ms",
    },
    {
      requestId: "REQ002",
      timestamp: "2025-08-24 10:35:00",
      customerName: "Jane Smith",
      langDetection: "100ms",
      nmt: "220ms",
      llm: "280ms",
      tts: "140ms",
      overallLatency: "740ms",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-6xl shadow-lg border-gray-200">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold text-center flex-1">
            Latency Details
          </CardTitle>
          <div className="ml-auto">
            <DropdownMenu
              triggerLabel="Switch User"
              items={[
                { label: "Customer 1", onClick: () => router.push("/customer1") },
                { label: "Customer 2", onClick: () => router.push("/customer2") },
                { label: "Admin", onClick: () => router.push("/admin") },
              ]}
            />
          </div>
        </CardHeader>
        <CardContent>
          <LatencyAdminTable data={sampleData} />
        </CardContent>
      </Card>
    </div>
  );
}
