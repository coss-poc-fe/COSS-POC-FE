'use client';

import { useEffect, useState } from "react";
import LatencyAdminTable from "@/components/LatencyAdminTable";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

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
    <div className="min-h-screen w-full bg-gray-50 p-6">
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ADMIN DASHBOARD</h1>
        <DropdownMenu
          triggerLabel="Switch User"
          items={[
            { label: "Customer 1", onClick: () => router.push("/customer/customer1") },
            { label: "Customer 2", onClick: () => router.push("/customer/customer2") },
            { label: "Admin", onClick: () => router.push("/admin") },
          ]}
        />
      </div>

     
      <div className="grid grid-cols-2 gap-6 h-[80vh]">
       
        <Card className="h-full w-full border border-gray-200">
           <CardHeader>
            <CardTitle className="text-xl font-semibold">Latency Details</CardTitle>
          </CardHeader>
          <CardContent className="h-full overflow-auto p-4">
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : (
              <LatencyAdminTable data={latencyData} />
            )}
          </CardContent>
        </Card>

        
        {!loading && latencyData.length > 0 && (
          <Card className="h-full w-full border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Latency Visualization</CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={latencyData}>
                  <XAxis dataKey="requestId" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="langdetectionLatency" stackId="a" fill="#8884d8" name="Lang Detection" />
                  <Bar dataKey="nmtLatency" stackId="a" fill="#82ca9d" name="NMT" />
                  <Bar dataKey="llmLatency" stackId="a" fill="#ffc658" name="LLM" />
                  <Bar dataKey="ttsLatency" stackId="a" fill="#ff8042" name="TTS" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
