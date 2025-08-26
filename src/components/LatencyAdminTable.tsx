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
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export interface LatencyData {
  requestId: string;
  customerName: string;
  customerApp: string;
  langdetectionLatency: number | string | null;
  nmtLatency: number | string | null;
  llmLatency: number | string | null;
  ttsLatency: number | string | null;
  overallPipelineLatency: number | string | null;
  nmtUsage: number | string | null;
  llmUsage: number | string | null;
  ttsUsage: number | string | null;
  timestamp: string;
}

interface LatencyAdminTableProps {
  data: LatencyData[];
}

// Convert ms → seconds safely, handle "none" as "-"
const msToSec = (val: string | number | null) => {
  if (val === null || val === undefined) return "-";
  if (typeof val === "string") {
    if (val.toLowerCase() === "none") return "-";
    const num = parseFloat(val.replace("ms", ""));
    if (!num || num === 0) return "-";
    return (num / 1000).toFixed(3);
  }
  if (val === 0) return "-";
  return (val / 1000).toFixed(3);
};

// Format usage values, handle "none" as "-"
const formatValue = (val: string | number | null) => {
  if (
    val === null ||
    val === undefined ||
    val === 0 ||
    val === "0" ||
    (typeof val === "string" && val.toLowerCase() === "none")
  ) {
    return "-";
  }
  return val;
};

const formatChartData = (data: LatencyData[]) =>
  data.slice(0, 10).map(item => ({
    name: item.requestId.substring(0, 8),
    langDetection: typeof item.langdetectionLatency === "number" ? item.langdetectionLatency / 1000 : 0,
    nmt: typeof item.nmtLatency === "number" ? item.nmtLatency / 1000 : 0,
    llm: typeof item.llmLatency === "number" ? item.llmLatency / 1000 : 0,
    tts: typeof item.ttsLatency === "number" ? item.ttsLatency / 1000 : 0,
    overall: typeof item.overallPipelineLatency === "number" ? item.overallPipelineLatency / 1000 : 0,
  }));

export default function LatencyAdminTable({ data }: LatencyAdminTableProps) {
  const chartData = formatChartData(data);

  return (
    <div className="flex flex-col w-full h-screen gap-4 p-4 overflow-hidden">
      {/* Table Card */}
      <Card className="shadow-lg rounded-2xl flex-1 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle>Latency Metrics</CardTitle>
        </CardHeader>
        <CardContent className="h-[calc(100%-60px)]">
          <div className="h-full overflow-auto border rounded-md">
            <Table>
              <TableHeader className="sticky top-0 bg-muted">
                <TableRow>
                  <TableHead className="font-bold">Request ID</TableHead>
                  <TableHead className="font-bold">Timestamp</TableHead>
                  <TableHead className="font-bold">Customer Name</TableHead>
                  <TableHead className="font-bold">Lang Detection (s)</TableHead>
                  <TableHead className="font-bold">NMT (s)</TableHead>
                  <TableHead className="font-bold">LLM (s)</TableHead>
                  <TableHead className="font-bold">TTS (s)</TableHead>
                  <TableHead className="font-bold">Overall (s)</TableHead>
                  <TableHead className="font-bold">NMT (Character)</TableHead>
                  <TableHead className="font-bold">LLM (Token)</TableHead>
                  <TableHead className="font-bold">TTS (Character)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, idx) => (
                  <TableRow key={row.requestId} className={idx % 2 === 0 ? "bg-muted/30" : ""}>
                    <TableCell className="font-mono text-xs">{row.requestId.substring(0, 8)}...</TableCell>
                    <TableCell>{new Date(row.timestamp).toLocaleString()}</TableCell>
                    <TableCell>{row.customerName || "-"}</TableCell>
                    <TableCell>{msToSec(row.langdetectionLatency)}</TableCell>
                    <TableCell>{msToSec(row.nmtLatency)}</TableCell>
                    <TableCell>{msToSec(row.llmLatency)}</TableCell>
                    <TableCell>{msToSec(row.ttsLatency)}</TableCell>
                    <TableCell className="font-medium">{msToSec(row.overallPipelineLatency)}</TableCell>
                    <TableCell>{formatValue(row.nmtUsage)}</TableCell>
                    <TableCell>{formatValue(row.llmUsage)}</TableCell>
                    <TableCell>{formatValue(row.ttsUsage)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Chart Card */}
      <Card className="shadow-lg rounded-2xl h-[400px]">
        <CardHeader className="pb-2">
          <CardTitle>Latency Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="h-[calc(100%-60px)]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="langDetection" fill="#8884d8" name="Lang Detection" />
              <Bar dataKey="nmt" fill="#82ca9d" name="NMT" />
              <Bar dataKey="llm" fill="#ffc658" name="LLM" />
              <Bar dataKey="tts" fill="#ff8042" name="TTS" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
