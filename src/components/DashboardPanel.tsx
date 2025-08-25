'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CustomerLatency,fetchCustomerLatency } from '@/lib/fetchCustomerLatency';


interface ProcessedData {
  requestId: string;
  nmt: number;
  llm: number;
  tts?: number;
  total: number;
}

interface CustomerLatencyDashboardProps {
  customerType: 'cust1' | 'cust2';
}

export default function CustomerLatencyDashboard({ customerType }: CustomerLatencyDashboardProps) {
  const [data, setData] = useState<ProcessedData[]>([]);
  const [loading, setLoading] = useState(true);
  const [useSample, setUseSample] = useState(false);

  // ✅ useMemo so we don't trigger ESLint warning in useEffect dependencies
  const sampleData: ProcessedData[] = useMemo(
    () => [
      { requestId: 'REQ001', nmt: 0.12, llm: 1.25, tts: 0.45, total: 1.82 },
      { requestId: 'REQ002', nmt: 0.15, llm: 1.1, tts: 0.4, total: 1.65 },
      { requestId: 'REQ003', nmt: 0.13, llm: 1.3, tts: 0.48, total: 1.91 },
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
  }, [customerType, sampleData]); // ✅ sampleData added to dependencies

  const filteredData = useMemo(
    () =>
      data.map((row) => {
        if (customerType === 'cust2')
          return { ...row, tts: undefined, total: row.nmt + row.llm };
        return row;
      }),
    [data, customerType]
  );

  return (
    <div className="h-full flex flex-col gap-3 mt-1">
      {/* Status */}
      <Card className="bg-blue-50 border-blue-200 p-2">
        <div className="flex justify-between items-center text-sm">
          <span>Data Source: {loading ? 'Loading...' : useSample ? 'Sample Data' : 'API Data'}</span>
          <span>Records: {filteredData.length}</span>
        </div>
      </Card>

      {/* Table */}
      <Card className="h-[440px] bg-white border-none rounded-none">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800">
            Latency Data {useSample && '(Sample)'}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>NMT Latency (s)</TableHead>
                <TableHead>LLM Latency (s)</TableHead>
                {customerType === 'cust1' && <TableHead>TTS Latency (s)</TableHead>}
                <TableHead>Total Response (s)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((row, idx) => (
                <TableRow key={row.requestId + idx}>
                  <TableCell>{row.requestId}</TableCell>
                  <TableCell>{row.nmt.toFixed(3)}</TableCell>
                  <TableCell>{row.llm.toFixed(3)}</TableCell>
                  {customerType === 'cust1' && <TableCell>{row.tts?.toFixed(3) ?? 'N/A'}</TableCell>}
                  <TableCell>{row.total.toFixed(3)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card className="h-[440px] bg-white border-none rounded-none">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800">
            Latency Visualization {useSample && '(Sample)'}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="requestId" angle={-45} textAnchor="end" height={60} interval={0} />
              <YAxis label={{ value: 'Latency (s)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value: number) => `${value.toFixed(3)}s`} />
              <Bar dataKey="nmt" stackId="a" fill="#8884d8" />
              <Bar dataKey="llm" stackId="a" fill="#82ca9d" />
              {customerType === 'cust1' && <Bar dataKey="tts" stackId="a" fill="#ffc658" />}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
