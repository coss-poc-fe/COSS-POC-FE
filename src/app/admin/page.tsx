"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Users, ShieldCheck, ChevronRight } from "lucide-react";

import LatencyAdminTable, { LatencyData } from "@/components/LatencyAdminTable";
import CustomerAggregateTable, {
  AggregateData,
} from "@/components/CustomerAggregateTable";
import RequestsOverviewTable, {
  ApiRequestsData,
  RequestsData,
} from "@/components/RequestsOverviewTable";
import DataProcessedTable, {
  ApiDataProcessed,
  DataProcessed,
} from "@/components/DataProcessedTable";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ----------------- Raw latency API response -----------------
interface ApiResponseItem {
  customername: string;
  customerapp: string;
  requestid: string;
  langdetectionlatency: string;
  nmtlatency: string;
  llmlatency: string;
  backnmtlatency: string;  
  ttslatency: string;
  overallpipelinelatency: string;
  timestamp: string;
  nmtusage: string | null;
  llmusage: string | null;
  backnmtusage: string | null; 
  ttsusage: string | null;
}


// ----------------- Aggregate API response -----------------
interface AggregateApiItem {
  customerName: string;
  customerApp: string;
  avg_langdetectionLatency: number | null;
  avg_nmtLatency: number | null;
  avg_llmLatency: number | null;
  avg_backNMTLatency: number | null;
  avg_ttsLatency: number | null;
  avg_overallPipelineLatency: number | null;
  avg_nmtUsage: number | null;
  avg_llmUsage: number | null;
  avg_backNMTUsage: number | null;
  avg_ttsUsage: number | null;
  p90_langdetectionLatency: number | null;
  p95_langdetectionLatency: number | null;
  p99_langdetectionLatency: number | null;
  p90_nmtLatency: number | null;
  p95_nmtLatency: number | null;
  p99_nmtLatency: number | null;
  p90_llmLatency: number | null;
  p95_llmLatency: number | null;
  p99_llmLatency: number | null;
  p90_backNMTLatency: number | null;
  p95_backNMTLatency: number | null;
  p99_backNMTLatency: number | null;
  p90_ttsLatency: number | null;
  p95_ttsLatency: number | null;
  p99_ttsLatency: number | null;
  p90_overallPipelineLatency: number | null;
  p95_overallPipelineLatency: number | null;
  p99_overallPipelineLatency: number | null;
}

const mockAggregateData: AggregateData[] = [
  {
    customerName: "AcmeCorp",
    customerApp: "mobile",

    // Latency
    langdetectionLatency: 123.45,
    nmtLatency: 456.78,
    llmLatency: 234.56,
    backnmtLatency: 300.12,
    ttsLatency: 345.67,
    overallPipelineLatency: 789.12,

    // Usage
    nmtUsage: 12.34,
    llmUsage: 23.45,
    backnmtUsage: 15.67,
    ttsUsage: 34.56,

    // P90/P95/P99
    p90_langdetectionLatency: 0,
    p95_langdetectionLatency: 0,
    p99_langdetectionLatency: 0,

    p90_nmtLatency: 1669,
    p95_nmtLatency: 1669,
    p99_nmtLatency: 1669,

    p90_llmLatency: 1737,
    p95_llmLatency: 1737,
    p99_llmLatency: 1737,

    p90_backnmtLatency: 1800,
    p95_backnmtLatency: 1850,
    p99_backnmtLatency: 1900,

    p90_ttsLatency: 2420,
    p95_ttsLatency: 2420,
    p99_ttsLatency: 2420,

    p90_overallPipelineLatency: 5828,
    p95_overallPipelineLatency: 5828,
    p99_overallPipelineLatency: 5828,
  },
];

export default function AdminPage() {
  const router = useRouter();

  // ----------------- States -----------------
  const [latencyData, setLatencyData] = useState<LatencyData[]>([]);
  const [aggregateData, setAggregateData] = useState<AggregateData[]>([]);
  const [requestsData, setRequestsData] = useState<RequestsData | null>(null);
  const [dataProcessed, setDataProcessed] = useState<DataProcessed | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [loadingAggregate, setLoadingAggregate] = useState(true);

  const [activeTab, setActiveTab] = useState<
    "aggregate" | "latency" | "requests" | "dataProcessed"
  >("aggregate");

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingDataProcessed, setLoadingDataProcessed] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestsError, setRequestsError] = useState<string | null>(null);
  const [dataProcessedError, setDataProcessedError] = useState<string | null>(null);

  // ----------------- Switch User -----------------
  const userOptions = [
    {
      id: "customer1",
      title: "Customer 1",
      description: "Audio + Text Pipeline",
      icon: User,
      route: "/customer/customer1",
      isActive: false,
    },
    {
      id: "customer2",
      title: "Customer 2",
      description: "Text-only Pipeline",
      icon: Users,
      route: "/customer/customer2",
      isActive: false,
    },
    {
      id: "admin",
      title: "Admin Dashboard",
      description: "System Management",
      icon: ShieldCheck,
      route: "/admin",
      isActive: true,
    },
  ];

  const handleUserSwitch = (route: string) => {
    router.push(route);
    setIsDialogOpen(false);
  };

  // ----------------- Fetch Latency -----------------
  useEffect(() => {
    async function fetchLatency() {
      try {
        const response = await fetch("/api/globalmetrices");
        if (!response.ok)
          throw new Error(`Failed to fetch data: ${response.status}`);
        const rawData: ApiResponseItem[] = await response.json();

        const formattedData: LatencyData[] = rawData.map((item) => ({
          customerName: item.customername,
          customerApp: item.customerapp,
          requestId: item.requestid,
          langdetectionLatency: parseFloat(item.langdetectionlatency || "0"),
          nmtLatency: parseFloat(item.nmtlatency || "0"),
          llmLatency: parseFloat(item.llmlatency || "0"),
          backnmtLatency: parseFloat(item.backnmtlatency || "0"), // <-- added
          ttsLatency: parseFloat(item.ttslatency || "0"),
          nmtUsage: item.nmtusage || "0",
          llmUsage: item.llmusage || "0",
          backnmtUsage: item.backnmtusage || "0", // <-- added
          ttsUsage: item.ttsusage || "0",
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

  // ----------------- Fetch Aggregate -----------------
  // ----------------- Fetch Aggregate -----------------
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

          const transformed: AggregateData[] = (data.aggregates || []).map(
            (item: AggregateApiItem) => ({
              customerName: item.customerName,
              customerApp: item.customerApp,

              // Latency
              langdetectionLatency: item.avg_langdetectionLatency ?? 0,
              nmtLatency: item.avg_nmtLatency ?? 0,
              llmLatency: item.avg_llmLatency ?? 0,
              backnmtLatency: item.avg_backNMTLatency ?? 0,
              ttsLatency: item.avg_ttsLatency ?? 0,
              overallPipelineLatency: item.avg_overallPipelineLatency ?? 0,

              // Usage
              nmtUsage: item.avg_nmtUsage ?? 0,
              llmUsage: item.avg_llmUsage ?? 0,
              backnmtUsage: item.avg_backNMTUsage ?? 0,
              ttsUsage: item.avg_ttsUsage ?? 0,

              // P90/P95/P99
              p90_langdetectionLatency: item.p90_langdetectionLatency ?? 0,
              p95_langdetectionLatency: item.p95_langdetectionLatency ?? 0,
              p99_langdetectionLatency: item.p99_langdetectionLatency ?? 0,

              p90_nmtLatency: item.p90_nmtLatency ?? 0,
              p95_nmtLatency: item.p95_nmtLatency ?? 0,
              p99_nmtLatency: item.p99_nmtLatency ?? 0,

              p90_llmLatency: item.p90_llmLatency ?? 0,
              p95_llmLatency: item.p95_llmLatency ?? 0,
              p99_llmLatency: item.p99_llmLatency ?? 0,

              p90_backnmtLatency: item.p90_backNMTLatency ?? 0,
              p95_backnmtLatency: item.p95_backNMTLatency ?? 0,
              p99_backnmtLatency: item.p99_backNMTLatency ?? 0,

              p90_ttsLatency: item.p90_ttsLatency ?? 0,
              p95_ttsLatency: item.p95_ttsLatency ?? 0,
              p99_ttsLatency: item.p99_ttsLatency ?? 0,

              p90_overallPipelineLatency: item.p90_overallPipelineLatency ?? 0,
              p95_overallPipelineLatency: item.p95_overallPipelineLatency ?? 0,
              p99_overallPipelineLatency: item.p99_overallPipelineLatency ?? 0,
            })
          );

          allData.push(...transformed);
        }

        // ✅ Set API data if available, else fallback to mock
        setAggregateData(allData.length > 0 ? allData : mockAggregateData);
      } catch (error) {
        console.error("Aggregate fetch error:", error);
        setAggregateData(mockAggregateData);
      } finally {
        setLoadingAggregate(false);
      }
    }

    fetchAggregate();
  }, []);

  // ----------------- Fetch Requests Overview -----------------
  useEffect(() => {
  async function fetchRequests() {
    try {
      // Fixed URL - add /api prefix
      const response = await fetch("/api/metrics/requests");
      if (!response.ok)
        throw new Error(`Failed to fetch requests: ${response.status}`);
      const apiData: ApiRequestsData = await response.json();

      // Transform API data to component format
      const transformedData: RequestsData = {
        totalRequests: apiData.total_requests,
        requestsByService: {
          nmt: apiData.requests_by_service.NMT,
          llm: apiData.requests_by_service.LLM,
          tts: apiData.requests_by_service.TTS,
          backNmt: apiData.requests_by_service.backNMT,
        },
        requestsByCustomer: Object.fromEntries(
          Object.entries(apiData.requests_by_customer).map(
            ([customer, data]) => [
              customer,
              {
                totalRequests: data.total,
                requestsByService: {
                  nmt: data.by_service.NMT,
                  llm: data.by_service.LLM,
                  tts: data.by_service.TTS,
                  backNmt: data.by_service.backNMT,
                },
              },
            ]
          )
        ),
      };

      setRequestsData(transformedData);
      setRequestsError(null);
    } catch (error) {
      console.error("Requests fetch error:", error);
      setRequestsError(`Failed to fetch requests: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Will use mock data from component
    } finally {
      setLoadingRequests(false);
    }
  }

  fetchRequests();
}, []);

// Update Fetch Data Processed
useEffect(() => {
  async function fetchDataProcessed() {
    try {
      // Fixed URL - add /api prefix
      const response = await fetch("/api/metrics/data_processed");
      if (!response.ok)
        throw new Error(`Failed to fetch data processed: ${response.status}`);
      const apiData: ApiDataProcessed = await response.json();

      // Transform API data to component format
      const transformedData: DataProcessed = {
        totals: {
          nmt: apiData.totals.NMT_chars,
          llm: apiData.totals.LLM_tokens,
          tts: apiData.totals.TTS_chars,
          backNmt: apiData.totals.backNMT_chars,
        },
        byCustomer: Object.fromEntries(
          Object.entries(apiData.byCustomer).map(([customer, data]) => [
            customer,
            {
              nmt: data.NMT_chars,
              llm: data.LLM_tokens,
              tts: data.TTS_chars,
              backNmt: data.backNMT_chars,
            },
          ])
        ),
      };

      setDataProcessed(transformedData);
      setDataProcessedError(null);
    } catch (error) {
      console.error("DataProcessed fetch error:", error);
      setDataProcessedError(`Failed to fetch data processed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Will use mock data from component
    } finally {
      setLoadingDataProcessed(false);
    }
  }

  fetchDataProcessed();
}, []);

  // ----------------- Render -----------------
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
          {isMobileSidebarOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
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

        {/* Top Section */}
        <div>
          <h1 className="text-lg lg:text-xl font-bold mb-6 lg:mb-9 text-slate-800">
            ADMIN PANEL
          </h1>

          {/* Quality of Services Section */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-slate-600 mb-2">
              Quality of Services
            </h2>
            <nav className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setActiveTab("aggregate");
                  setIsMobileSidebarOpen(false);
                }}
                className={`text-left p-2 rounded transition-colors ${
                  activeTab === "aggregate"
                    ? "bg-slate-50 text-slate-800 font-semibold"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Aggregate
              </button>
              <button
                onClick={() => {
                  setActiveTab("latency");
                  setIsMobileSidebarOpen(false);
                }}
                className={`text-left p-2 rounded transition-colors ${
                  activeTab === "latency"
                    ? "bg-slate-50 text-slate-800 font-semibold"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Detailed
              </button>
            </nav>
          </div>

          {/* System Usage Section */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-slate-600 mb-2">
              System Usage
            </h2>
            <nav className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setActiveTab("requests");
                  setIsMobileSidebarOpen(false);
                }}
                className={`text-left p-2 rounded transition-colors ${
                  activeTab === "requests"
                    ? "bg-slate-50 text-slate-800 font-semibold"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Requests Overview
              </button>
              <button
                onClick={() => {
                  setActiveTab("dataProcessed");
                  setIsMobileSidebarOpen(false);
                }}
                className={`text-left p-2 rounded transition-colors ${
                  activeTab === "dataProcessed"
                    ? "bg-slate-50 text-slate-800 font-semibold"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Data Processed
              </button>
            </nav>
          </div>
        </div>

        {/* Bottom Section: Switch User */}
        <div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="w-full bg-slate-900 hover:bg-slate-700 text-white"
          >
            Switch User
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-full">
        <div className="lg:hidden h-16 flex-shrink-0"></div>

        <div className="flex-1 flex flex-col min-h-0 p-2 sm:p-4 overflow-auto">
          {activeTab === "aggregate" && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 bg-white rounded-lg lg:rounded-3xl shadow-sm border border-slate-200 p-2 sm:p-4 overflow-auto">
                <h2 className="text-xl font-semibold mb-4">
                  Customer Aggregate Metrics
                </h2>
                {loadingAggregate ? (
                  <p className="text-center text-gray-500">
                    Loading aggregate metrics...
                  </p>
                ) : (
                  <CustomerAggregateTable data={aggregateData} />
                )}
              </div>
            </div>
          )}

          {activeTab === "latency" && (
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

          {activeTab === "requests" && (
            <div className="flex-1 flex flex-col min-h-0">
              {loadingRequests ? (
                <div className="flex-1 bg-white rounded-lg lg:rounded-3xl shadow-sm border border-slate-200 p-2 sm:p-4 overflow-auto">
                  <h2 className="text-xl font-semibold mb-4">
                    Requests Overview
                  </h2>
                  <p className="text-center text-gray-500">
                    Loading requests data...
                  </p>
                </div>
              ) : (
                <RequestsOverviewTable data={requestsData} />
              )}
            </div>
          )}

          {activeTab === "dataProcessed" && (
            <div className="flex-1 flex flex-col min-h-0">
              {loadingDataProcessed ? (
                <div className="flex-1 bg-white rounded-lg lg:rounded-3xl shadow-sm border border-slate-200 p-2 sm:p-4 overflow-auto">
                  <h2 className="text-xl font-semibold mb-4">Data Processed</h2>
                  <p className="text-center text-gray-500">
                    Loading data processed metrics...
                  </p>
                </div>
              ) : (
                <DataProcessedTable data={dataProcessed} />
              )}
            </div>
          )}
        </div>
      </main>

      {/* Switch User Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="mx-4 max-w-md sm:max-w-lg">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-semibold text-slate-900 text-center">
              Switch Account
            </DialogTitle>
            <p className="text-sm text-slate-600 text-center">
              Select an account to continue with different access levels
            </p>
          </DialogHeader>

          <div className="space-y-2 mt-6">
            {userOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => handleUserSwitch(option.route)}
                  className={`
                    w-full flex items-center justify-between p-4 rounded-lg border transition-all duration-200
                    ${
                      option.isActive
                        ? "bg-slate-50 border-slate-300 ring-2 ring-slate-200"
                        : "hover:bg-slate-100 hover:border-slate-300 border-slate-100"
                    }
                  `}
                  disabled={option.isActive}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                      p-2 rounded-full
                      ${option.isActive ? "bg-slate-200" : "bg-slate-100"}
                    `}
                    >
                      <IconComponent className="h-4 w-4 text-slate-600" />
                    </div>
                    <div className="text-left">
                      <div
                        className={`font-medium ${
                          option.isActive ? "text-slate-900" : "text-slate-800"
                        }`}
                      >
                        {option.title}
                        {option.isActive && (
                          <span className="ml-2 text-xs text-slate-500">
                            (Current)
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-slate-600">
                        {option.description}
                      </div>
                    </div>
                  </div>
                  {!option.isActive && (
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="px-6"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
