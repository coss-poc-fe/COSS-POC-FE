'use client';

import { useEffect, useState } from "react";
import LatencyAdminTable from "@/components/LatencyAdminTable";
import CustomerAggregateTable, { AggregateData } from "@/components/CustomerAggregateTable";
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

interface ApiResponseItem {
  customername: string;
  customerapp: string;
  requestid: string;
  langdetectionlatency: number;
  nmtlatency: number;
  llmlatency: number;
  ttslatency: number;
  overallpipelinelatency: number;
}

interface CustomerAggregateResponse {
  aggregates: AggregateData[];
}

export default function AdminPage() {
  const router = useRouter();
  const [latencyData, setLatencyData] = useState<LatencyData[]>([]);
  const [aggregateData, setAggregateData] = useState<AggregateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAggregate, setLoadingAggregate] = useState(true);

  const mockAggregateData: AggregateData[] = [
    {
      customerName: "AcmeCorp",
      customerApp: "mobile",
      langdetectionLatency: 123.45,
      nmtLatency: 456.78,
      llmLatency: 234.56,
      ttsLatency: 345.67,
      overallPipelineLatency: 789.12,
      nmtUsage: 12.34,
      llmUsage: 23.45,
      ttsUsage: 34.56,
    },
    {
      customerName: "AcmeCorp",
      customerApp: "web",
      langdetectionLatency: 111.11,
      nmtLatency: 222.22,
      llmLatency: 333.33,
      ttsLatency: 444.44,
      overallPipelineLatency: 555.55,
      nmtUsage: 10.0,
      llmUsage: 20.0,
      ttsUsage: 30.0,
    },
  ];

  // Fetch latency data
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/globalmetrices");
        if (!response.ok) throw new Error(`Failed to fetch data: ${response.status}`);
        const rawData: ApiResponseItem[] = await response.json();
        const formattedData: LatencyData[] = rawData.map((item) => ({
          customerName: item.customername,
          customerApp: item.customerapp,
          requestId: item.requestid,
          langdetectionLatency: item.langdetectionlatency,
          nmtLatency: item.nmtlatency,
          llmLatency: item.llmlatency,
          ttsLatency: item.ttslatency,
          overallPipelineLatency: item.overallpipelinelatency,
        }));
        setLatencyData(formattedData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Fetch aggregate data
  useEffect(() => {
    async function fetchAggregate() {
      try {
        const response = await fetch("/api/customer-aggregate");
        if (!response.ok) throw new Error(`Failed to fetch aggregate: ${response.status}`);
        const data: CustomerAggregateResponse = await response.json();
        setAggregateData(data.aggregates);
      } catch (error) {
        console.error(error);
        setAggregateData(mockAggregateData); // fallback
      } finally {
        setLoadingAggregate(false);
      }
    }
    fetchAggregate();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      {/* Header */}
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

      {/* Latency Table */}
      <div className="h-[40vh] mb-6">
        <Card className="h-full w-full border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Latency Details</CardTitle>
          </CardHeader>
          <CardContent className="h-full overflow-auto p-4">
            {loading ? <p className="text-center text-gray-500">Loading...</p> : <LatencyAdminTable data={latencyData} />}
          </CardContent>
        </Card>
      </div>

      {/* Aggregate Table */}
      <div className="h-[40vh]">
        <Card className="h-full w-full border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Customer Aggregate Metrics</CardTitle>
          </CardHeader>
          <CardContent className="h-full overflow-auto p-4">
            {loadingAggregate ? (
              <p className="text-center text-gray-500">Loading aggregate metrics...</p>
            ) : (
              <CustomerAggregateTable aggregates={aggregateData} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
