'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

// Import your existing components
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

interface CustomerAggregateResponse {
  aggregates: AggregateData[];
}

// Mock fallback data for aggregates
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

export default function AdminPage() {
  const router = useRouter();
  const [latencyData, setLatencyData] = useState<LatencyData[]>([]);
  const [aggregateData, setAggregateData] = useState<AggregateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAggregate, setLoadingAggregate] = useState(true);
  const [activeTab, setActiveTab] = useState<'aggregate' | 'latency'>('aggregate');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
          langdetectionLatency: parseFloat(item.langdetectionlatency || "0"),
          nmtLatency: parseFloat(item.nmtlatency || "0"),
          llmLatency: parseFloat(item.llmlatency || "0"),
          ttsLatency: parseFloat(item.ttslatency || "0"),
          overallPipelineLatency: parseFloat(item.overallpipelinelatency || "0"),
          timestamp: item.timestamp,
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
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Mobile Menu Button */}
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
      <aside className={`
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        fixed lg:relative z-40 w-64 lg:w-70 bg-white shadow-md 
        flex flex-col justify-between p-4 lg:p-7 border-r border-slate-200
        h-full
      `}>
        {/* Overlay for mobile */}
        {isMobileSidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-white bg-opacity-50 -z-10"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
        
        <div>
          <h1 className="text-lg lg:text-xl font-bold mb-6 lg:mb-9 text-slate-800">ADMIN PANEL</h1>
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
        {/* Mobile header space */}
        <div className="lg:hidden h-16 flex-shrink-0"></div>
        
        {/* Content Area */}
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