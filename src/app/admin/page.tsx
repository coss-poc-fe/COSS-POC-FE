'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

import LatencyAdminTable, { LatencyData } from "@/components/LatencyAdminTable";
import CustomerAggregateTable, { AggregateData } from "@/components/CustomerAggregateTable";

interface ApiResponseItem {
  customername: string;
  customerapp: string;
  requestid: string;
  langdetectionlatency: string;
  nmtlatency: string;
  llmlatency: string;
  ttslatency: string;
  overallpipelinelatency: string;
  timestamp: string;
}

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
    p90_langdetectionLatency: 0,
    p95_langdetectionLatency: 0,
    p99_langdetectionLatency: 0,
    p90_nmtLatency: 1669,
    p95_nmtLatency: 1669,
    p99_nmtLatency: 1669,
    p90_llmLatency: 1737,
    p95_llmLatency: 1737,
    p99_llmLatency: 1737,
    p90_ttsLatency: 2420,
    p95_ttsLatency: 2420,
    p99_ttsLatency: 2420,
    p90_overallPipelineLatency: 5828,
    p95_overallPipelineLatency: 5828,
    p99_overallPipelineLatency: 5828,
  }
];

export default function AdminPage() {
  const router = useRouter();
  const [latencyData, setLatencyData] = useState<LatencyData[]>([]);
  const [aggregateData, setAggregateData] = useState<AggregateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAggregate, setLoadingAggregate] = useState(true);
  const [activeTab, setActiveTab] = useState<'aggregate' | 'latency'>('aggregate');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Fetch latency data (raw requests)
  useEffect(() => {
    async function fetchLatency() {
      try {
        const response = await fetch("/api/globalmetrices");
        if (!response.ok) throw new Error(`Failed to fetch data: ${response.status}`);
        const rawData: ApiResponseItem[] = await response.json();

        const formattedData: LatencyData[] = rawData.map((item) => ({
          customerName: item.customername,
          customerApp: item.customerapp,
          requestId: item.requestid,
          langdetectionLatency: parseFloat(item.langdetectionlatency || "0"),
          nmtLatency: parseFloat(item.nmtlatency || "0"),
          llmLatency: parseFloat(item.llmlatency || "0"),
          ttsLatency: parseFloat(item.ttslatency || "0"),
          overallPipelineLatency: parseFloat(item.overallpipelinelatency || "0"),
          timestamp: item.timestamp,
        }));

        setLatencyData(formattedData);
      } catch (error) {
        console.error("Latency fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLatency();
  }, []);

  // Fetch aggregate data with p90/p95/p99
  // Fetch aggregate data with p90/p95/p99
useEffect(() => {
  async function fetchAggregate() {
    try {
      const customers = ["cust1", "cust2"];
      const allData: AggregateData[] = [];

      for (const name of customers) {
        const response = await fetch("/api/customer-aggregate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customerName: name }),
        });

        if (!response.ok) throw new Error(`Failed for ${name}`);
        const data = await response.json();

        const transformed: AggregateData[] = (data.aggregates || []).map((item: any) => ({
          customerName: item.customerName,
          customerApp: item.customerApp,
          langdetectionLatency: Number(item.avg_langdetectionLatency ?? 0),
          nmtLatency: Number(item.avg_nmtLatency ?? 0),
          llmLatency: Number(item.avg_llmLatency ?? 0),
          ttsLatency: Number(item.avg_ttsLatency ?? 0),
          overallPipelineLatency: Number(item.avg_overallPipelineLatency ?? 0),
          nmtUsage: Number(item.avg_nmtUsage ?? 0),
          llmUsage: Number(item.avg_llmUsage ?? 0),
          ttsUsage: Number(item.avg_ttsUsage ?? 0),
          p90_langdetectionLatency: Number(item.p90_langdetectionLatency ?? 0),
          p95_langdetectionLatency: Number(item.p95_langdetectionLatency ?? 0),
          p99_langdetectionLatency: Number(item.p99_langdetectionLatency ?? 0),
          p90_nmtLatency: Number(item.p90_nmtLatency ?? 0),
          p95_nmtLatency: Number(item.p95_nmtLatency ?? 0),
          p99_nmtLatency: Number(item.p99_nmtLatency ?? 0),
          p90_llmLatency: Number(item.p90_llmLatency ?? 0),
          p95_llmLatency: Number(item.p95_llmLatency ?? 0),
          p99_llmLatency: Number(item.p99_llmLatency ?? 0),
          p90_ttsLatency: Number(item.p90_ttsLatency ?? 0),
          p95_ttsLatency: Number(item.p95_ttsLatency ?? 0),
          p99_ttsLatency: Number(item.p99_ttsLatency ?? 0),
          p90_overallPipelineLatency: Number(item.p90_overallPipelineLatency ?? 0),
          p95_overallPipelineLatency: Number(item.p95_overallPipelineLatency ?? 0),
          p99_overallPipelineLatency: Number(item.p99_overallPipelineLatency ?? 0),
        }));

        allData.push(...transformed);
      }

      setAggregateData(allData);
    } catch (error) {
      console.error("Aggregate fetch error:", error);
      setAggregateData(mockAggregateData);
    } finally {
      setLoadingAggregate(false);
    }
  }

  fetchAggregate();
}, []);



  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          variant="outline"
          size="sm"
          className="bg-white shadow-md"
        >
          {isMobileSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 transition-transform duration-300 ease-in-out
          fixed lg:relative z-40 w-64 lg:w-70 bg-white shadow-md 
          flex flex-col justify-between p-4 lg:p-7 border-r border-slate-200
          h-full
        `}
      >
        {isMobileSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-white bg-opacity-50 -z-10"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        <div>
          <h1 className="text-lg lg:text-xl font-bold mb-6 lg:mb-9 text-slate-800">
            ADMIN PANEL
          </h1>
          <nav className="flex flex-col gap-3">
            <button
              onClick={() => {
                setActiveTab('aggregate');
                setIsMobileSidebarOpen(false);
              }}
              className={`text-left p-2 rounded transition-colors ${
                activeTab === 'aggregate'
                  ? 'bg-slate-50 text-slate-800 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Customer Aggregates
            </button>
            <button
              onClick={() => {
                setActiveTab('latency');
                setIsMobileSidebarOpen(false);
              }}
              className={`text-left p-2 rounded transition-colors ${
                activeTab === 'latency'
                  ? 'bg-slate-50 text-slate-800 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Latency Details
            </button>
          </nav>
        </div>

        <div>
          <Button
            onClick={() => router.push("/customer/customer1")}
            className="w-full bg-slate-900 hover:bg-slate-700 text-white"
          >
            Switch to Customer View
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-full">
        <div className="lg:hidden h-16 flex-shrink-0"></div>

        <div className="flex-1 flex flex-col min-h-0 p-2 sm:p-4 overflow-auto">
          {activeTab === 'aggregate' && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 bg-white rounded-lg lg:rounded-3xl shadow-sm border border-slate-200 p-2 sm:p-4 overflow-auto">
                <h2 className="text-xl font-semibold mb-4">Customer Aggregate Metrics</h2>
                {loadingAggregate ? (
                  <p className="text-center text-gray-500">Loading aggregate metrics...</p>
                ) : (
                  <CustomerAggregateTable data={aggregateData} />
                )}
              </div>
            </div>
          )}

          {activeTab === 'latency' && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 bg-white rounded-lg lg:rounded-3xl shadow-sm border border-slate-200 p-2 sm:p-4 overflow-auto">
                <h2 className="text-xl font-semibold mb-4">Latency Details</h2>
                {loading ? (
                  <p className="text-center text-gray-500">Loading...</p>
                ) : (
                  <LatencyAdminTable data={latencyData} />
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
