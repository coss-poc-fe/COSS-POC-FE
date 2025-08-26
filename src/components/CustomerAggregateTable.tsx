'use client';

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface AggregateData {
  customerName: string;
  customerApp: string;

  langdetectionLatency: number;
  nmtLatency: number;
  llmLatency: number;
  ttsLatency: number;
  overallPipelineLatency: number;

  p90_langdetectionLatency: number;
  p95_langdetectionLatency: number;
  p99_langdetectionLatency: number;
  p90_nmtLatency: number;
  p95_nmtLatency: number;
  p99_nmtLatency: number;
  p90_llmLatency: number;
  p95_llmLatency: number;
  p99_llmLatency: number;
  p90_ttsLatency: number;
  p95_ttsLatency: number;
  p99_ttsLatency: number;
  p90_overallPipelineLatency: number;
  p95_overallPipelineLatency: number;
  p99_overallPipelineLatency: number;

  nmtUsage: number;
  llmUsage: number;
  ttsUsage: number;
}

interface CustomerAggregateProps {
  data: AggregateData[];
}

// Utility functions
const msToSeconds = (ms: number | null | undefined) => {
  if (!ms || ms === 0) return "-";
  return (ms / 1000).toFixed(2);
};

const formatValue = (val: number | string | null | undefined) => {
  if (val === null || val === "none" || val === undefined || val === 0 || val === "0") return "-";
  return val;
};

const formatLatencyChartData = (data: AggregateData[]) =>
  data.map(item => ({
    name: `${item.customerName}-${item.customerApp}`,
    p90: item.p90_overallPipelineLatency / 1000,
    p95: item.p95_overallPipelineLatency / 1000,
    p99: item.p99_overallPipelineLatency / 1000,
  }));

const formatUsageChartData = (data: AggregateData[]) =>
  data.map(item => ({
    name: `${item.customerName}-${item.customerApp}`,
    nmt: item.nmtUsage,
    llm: item.llmUsage,
    tts: item.ttsUsage,
  }));

const CustomerAggregateTable: React.FC<CustomerAggregateProps> = ({ data }) => {
  if (!data?.length) return <p>No data available</p>;

  const latencyChartData = formatLatencyChartData(data);
  const usageChartData = formatUsageChartData(data);

  return (
    <div className="flex w-full h-screen gap-4 p-4 overflow-hidden">
      {/* Latency Container */}
      <div className="flex-1 flex flex-col h-full">
        <Card className="shadow-lg rounded-2xl h-full flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle>Latency Metrics (p90/p95/p99)</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 flex-1 overflow-hidden">
            <div className="overflow-auto flex-1 border rounded-md">
              <Table>
                <TableHeader className="sticky top-0 bg-muted">
                  <TableRow>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>App</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead>p90 (s)</TableHead>
                    <TableHead>p95 (s)</TableHead>
                    <TableHead>p99 (s)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, idx) => {
                    const latencies = [
                      { name: "Lang Detection", p90: row.p90_langdetectionLatency, p95: row.p95_langdetectionLatency, p99: row.p99_langdetectionLatency },
                      { name: "NMT", p90: row.p90_nmtLatency, p95: row.p95_nmtLatency, p99: row.p99_nmtLatency },
                      { name: "LLM", p90: row.p90_llmLatency, p95: row.p95_llmLatency, p99: row.p99_llmLatency },
                      { name: "TTS", p90: row.p90_ttsLatency, p95: row.p95_ttsLatency, p99: row.p99_ttsLatency },
                      { name: "Overall", p90: row.p90_overallPipelineLatency, p95: row.p95_overallPipelineLatency, p99: row.p99_overallPipelineLatency },
                    ];
                    return latencies.map((lat, i) => (
                      <TableRow key={`lat-${idx}-${i}`} className={(idx + i) % 2 === 0 ? "bg-muted/30" : ""}>
                        {i === 0 && <TableCell rowSpan={latencies.length}>{row.customerName || "-"}</TableCell>}
                        {i === 0 && <TableCell rowSpan={latencies.length}>{row.customerApp || "-"}</TableCell>}
                        <TableCell>{lat.name}</TableCell>
                        <TableCell>{msToSeconds(lat.p90)}</TableCell>
                        <TableCell>{msToSeconds(lat.p95)}</TableCell>
                        <TableCell>{msToSeconds(lat.p99)}</TableCell>
                      </TableRow>
                    ));
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="h-[250px] min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={latencyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="p90" fill="#8884d8" name="p90" />
                  <Bar dataKey="p95" fill="#82ca9d" name="p95" />
                  <Bar dataKey="p99" fill="#ffc658" name="p99" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Container */}
      <div className="flex-1 flex flex-col h-full">
        <Card className="shadow-lg rounded-2xl h-full flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle>Usage Metrics</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 flex-1 overflow-hidden">
            <div className="overflow-auto flex-1 border rounded-md">
              <Table>
                <TableHeader className="sticky top-0 bg-muted">
                  <TableRow>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>App</TableHead>
                    <TableHead>NMT (Characters)</TableHead>
                    <TableHead>LLM (Tokens)</TableHead>
                    <TableHead>TTS (Characters)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, idx) => (
                    <TableRow key={`usage-${idx}`} className={idx % 2 === 0 ? "bg-muted/30" : ""}>
                      <TableCell>{row.customerName || "-"}</TableCell>
                      <TableCell>{row.customerApp || "-"}</TableCell>
                      <TableCell>{formatValue(row.nmtUsage)}</TableCell>
                      <TableCell>{formatValue(row.llmUsage)}</TableCell>
                      <TableCell>{formatValue(row.ttsUsage)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="h-[250px] min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usageChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="nmt" fill="#8884d8" name="NMT Usage" />
                  <Bar dataKey="llm" fill="#82ca9d" name="LLM Usage" />
                  <Bar dataKey="tts" fill="#ffc658" name="TTS Usage" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerAggregateTable;
