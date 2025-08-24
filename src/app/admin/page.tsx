'use client';

import { useEffect, useState } from "react";
import LatencyAdminTable from "@/components/LatencyAdminTable";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export interface LatencyData {
  customerName: string;
  customerApp: string;
  requestId: string;
  langdetectionLatency: number;
  nmtLatency: number;
  llmLatency: number;
  ttsLatency: number;
  overallPipelineLatency: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [latencyData, setLatencyData] = useState<LatencyData[]>([]);
  const [loading, setLoading] = useState(true);

  // Call API when component mounts
  useEffect(() => {
  async function fetchData() {
    try {
      const response = await fetch("/api/globalmetrices");
      if (!response.ok) throw new Error(`Failed to fetch data: ${response.status}`);
      const data: LatencyData[] = await response.json();
      setLatencyData(data ?? []);
    } catch (error) {
      console.error("Error fetching data:", error instanceof Error ? error.message : error);
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, []);


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
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : (
            <LatencyAdminTable data={latencyData} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
