'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CustomerLatency, fetchCustomerLatency } from '@/lib/fetchCustomerLatency';

interface ProcessedData {
  requestId: string;
  nmt: number;
  llm: number;
  tts?: number;
  total: number;
  timestamp: string;
}

interface CustomerLatencyDashboardProps {
  customerType: 'cust1' | 'cust2';
}

export default function CustomerLatencyDashboard({ customerType }: CustomerLatencyDashboardProps) {
  const [data, setData] = useState<ProcessedData[]>([]);
  const [loading, setLoading] = useState(true);
  const [useSample, setUseSample] = useState(false);

  // Sample data with timestamp for fallback
  const sampleData: ProcessedData[] = useMemo(
    () => [
      { requestId: 'REQ001', nmt: 0.12, llm: 1.25, tts: 0.45, total: 1.82, timestamp: '2025-08-26T04:46:12.083990+00:00' },
      { requestId: 'REQ002', nmt: 0.15, llm: 1.1, tts: 0.4, total: 1.65, timestamp: '2025-08-26T04:47:15.083990+00:00' },
      { requestId: 'REQ003', nmt: 0.13, llm: 1.3, tts: 0.48, total: 1.91, timestamp: '2025-08-26T04:48:20.083990+00:00' },
      { requestId: 'REQ004', nmt: 0.11, llm: 1.15, tts: 0.42, total: 1.68, timestamp: '2025-08-26T04:49:25.083990+00:00' },
      { requestId: 'REQ005', nmt: 0.14, llm: 1.35, tts: 0.46, total: 1.95, timestamp: '2025-08-26T04:50:30.083990+00:00' },
    ],
    []
  );

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const apiData: CustomerLatency[] = await fetchCustomerLatency(customerType);

        if (!apiData || apiData.length === 0) throw new Error('No data returned');

        const processed: ProcessedData[] = apiData.map((row) => ({
          requestId: row.requestid.slice(0, 8),
          nmt: parseFloat(row.nmtlatency.replace('ms', '')) / 1000,
          llm: parseFloat(row.llmlatency.replace('ms', '')) / 1000,
          tts: row.ttslatency ? parseFloat(row.ttslatency.replace('ms', '')) / 1000 : undefined,
          total: parseFloat(row.overallpipelinelatency.replace('ms', '')) / 1000,
          timestamp: row.timestamp
        }));

        setData(processed);
        setUseSample(false);
      } catch (err) {
        console.warn('Falling back to sample data:', err);
        setData(sampleData);
        setUseSample(true);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [customerType, sampleData]);

  const filteredData = useMemo(
    () =>
      data.map((row) => {
        if (customerType === 'cust2')
          return { ...row, tts: undefined, total: row.nmt + row.llm };
        return row;
      }),
    [data, customerType]
  );

  // Utility to format timestamps nicely
  const formatTimestamp = (ts: string) => {
    const date = new Date(ts);
    return date.toLocaleString('en-IN', { 
      hour12: true,
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-full flex flex-col gap-3 overflow-hidden">
      {/* Status Card */}
      <Card className="bg-slate-50 border-slate-200 flex-shrink-0">
        <div className="p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-md">
          <span>Data Source: {loading ? 'Loading...' : useSample ? 'Sample Data' : 'API Data'}</span>
          <span>Records: {filteredData.length}</span>
        </div>
      </Card>

      {/* Content - Vertical Layout: Table above, Chart below */}
      <div className="flex-1 flex flex-col gap-3 overflow-hidden min-h-0">
        
        {/* Table Card - Top Half */}
        <Card className="bg-white border-slate-200 flex flex-col min-h-0 flex-1">
          <CardHeader className="flex-shrink-0 pb-3">
            <CardTitle className="text-base sm:text-lg text-gray-800">
              Latency Data {useSample && '(Sample)'}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0 px-6 pb-6">
            <div className="h-full overflow-auto border rounded-md">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow>
                    <TableHead className="text-xs">Request ID</TableHead>
                    <TableHead className="text-xs hidden sm:table-cell">Timestamp</TableHead>
                    <TableHead className="text-xs">NMT (s)</TableHead>
                    <TableHead className="text-xs">LLM (s)</TableHead>
                    {customerType === 'cust1' && <TableHead className="text-xs">TTS (s)</TableHead>}
                    <TableHead className="text-xs">Total (s)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((row, idx) => (
                    <TableRow key={row.requestId + idx} className="text-xs">
                      <TableCell className="font-mono">{row.requestId}</TableCell>
                      <TableCell className="hidden sm:table-cell text-xs">{formatTimestamp(row.timestamp)}</TableCell>
                      <TableCell>{row.nmt.toFixed(3)}</TableCell>
                      <TableCell>{row.llm.toFixed(3)}</TableCell>
                      {customerType === 'cust1' && <TableCell>{row.tts?.toFixed(3) ?? 'N/A'}</TableCell>}
                      <TableCell className="font-semibold">{row.total.toFixed(3)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Chart Card - Bottom Half */}
        <Card className="bg-white border-slate-200 flex flex-col min-h-0 flex-1">
          <CardHeader className="flex-shrink-0 pb-3">
            <CardTitle className="text-base sm:text-lg text-gray-800">
              Latency Visualization {useSample && '(Sample)'}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-0">
            <div className="h-full min-h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={filteredData} 
                  margin={{ top: 10, right: 15, left: 15, bottom: 20 }}
                >
                  <XAxis 
                    dataKey="requestId" 
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }}
                    label={{ 
                      value: 'Latency (s)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { fontSize: '10px' }
                    }} 
                  />
                  <Tooltip 
                    formatter={(value: number) => `${value.toFixed(3)}s`}
                    contentStyle={{ fontSize: '12px' }}
                  />
                  <Bar dataKey="nmt" stackId="a" fill="#8884d8" name="NMT" />
                  <Bar dataKey="llm" stackId="a" fill="#82ca9d" name="LLM" />
                  {customerType === 'cust1' && <Bar dataKey="tts" stackId="a" fill="#ffc658" name="TTS" />}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}