"use client";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

// Helpers
const msToSec = (val: number | string | null) => {
  if (
    val === null ||
    val === undefined ||
    val === "none" ||
    val === "NONE" ||
    val === "None" ||
    val === 0 ||
    val === "0"
  )
    return "-";
  const num =
    typeof val === "string"
      ? parseFloat(val.toString().replace("ms", ""))
      : val;
  if (!num) return "-";
  return (num / 1000).toFixed(3);
};

const formatValue = (val: number | string | null) => {
  if (
    val === null ||
    val === undefined ||
    val === "none" ||
    val === "None" ||
    val === 0 ||
    val === "0"
  )
    return "-";
  return val;
};

const formatTimestamp = (ts: string) => {
  if (!ts) return "-";
  const fixedTs = ts.replace(/\.(\d{3})\d+/, ".$1");
  const date = new Date(fixedTs + "Z");
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Kolkata",
    hour12: true,
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return new Intl.DateTimeFormat("en-IN", options).format(date);
};

// Preprocess data
const normalizeData = (data: LatencyData[]): LatencyData[] =>
  data.map((item) => ({
    ...item,
    langdetectionLatency:
      item.langdetectionLatency === "none" ? "-" : item.langdetectionLatency,
    nmtLatency: item.nmtLatency === "none" ? "-" : item.nmtLatency,
    llmLatency: item.llmLatency === "none" ? "-" : item.llmLatency,
    ttsLatency: item.ttsLatency === "none" ? "-" : item.ttsLatency,
    overallPipelineLatency:
      item.overallPipelineLatency === "none"
        ? "-"
        : item.overallPipelineLatency,
    nmtUsage: item.nmtUsage === "none" ? "-" : item.nmtUsage,
    llmUsage: item.llmUsage === "none" ? "-" : item.llmUsage,
    ttsUsage: item.ttsUsage === "none" ? "-" : item.ttsUsage,
  }));

// Chart data
const formatLatencyChartData = (data: LatencyData[]) =>
  data.slice(0, 10).map((item) => ({
    name: item.requestId.substring(0, 8),
    langDetection:
      typeof item.langdetectionLatency === "number"
        ? item.langdetectionLatency / 1000
        : 0,
    nmt: typeof item.nmtLatency === "number" ? item.nmtLatency / 1000 : 0,
    llm: typeof item.llmLatency === "number" ? item.llmLatency / 1000 : 0,
    tts: typeof item.ttsLatency === "number" ? item.ttsLatency / 1000 : 0,
    overall:
      typeof item.overallPipelineLatency === "number"
        ? item.overallPipelineLatency / 1000
        : 0,
  }));

const formatUsageChartData = (data: LatencyData[]) =>
  data.slice(0, 10).map((item) => ({
    name: item.requestId.substring(0, 8),
    nmt: Number(item.nmtUsage) || 0,
    llm: Number(item.llmUsage) || 0,
    tts: Number(item.ttsUsage) || 0,
  }));

export default function LatencyAdminTable({ data }: LatencyAdminTableProps) {
  const normalizedData = normalizeData(data);

  // Dropdown filters for each table
  const [latencyFilter, setLatencyFilter] = React.useState<string>("All");
  const [usageFilter, setUsageFilter] = React.useState<string>("All");

  // Unique customer names
  const customerNames = Array.from(
    new Set(normalizedData.map((d) => d.customerName))
  ).filter(Boolean) as string[];

  // Filtered data based on dropdown
  const filteredLatencyData = normalizedData.filter(
    (d) => latencyFilter === "All" || d.customerName === latencyFilter
  );
  const filteredUsageData = normalizedData.filter(
    (d) => usageFilter === "All" || d.customerName === usageFilter
  );

  const latencyChartData = formatLatencyChartData(filteredLatencyData);
  const usageChartData = formatUsageChartData(filteredUsageData);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full min-h-screen p-4">
      {/* Latency Metrics */}
      <Card className="shadow-lg rounded-2xl flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-black">Latency Metrics</CardTitle>
          <Select value={latencyFilter} onValueChange={setLatencyFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select customer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Customers</SelectItem>
              {customerNames.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 flex-1">
          <div className="max-h-[400px] overflow-auto border rounded-md">
            <Table>
              <TableHeader className="sticky top-0 bg-muted">
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Lang Detection (s)</TableHead>
                  <TableHead>NMT (s)</TableHead>
                  <TableHead>LLM (s)</TableHead>
                  <TableHead>TTS (s)</TableHead>
                  <TableHead>Overall (s)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLatencyData.map((row, idx) => (
                  <TableRow
                    key={row.requestId}
                    className={idx % 2 === 0 ? "bg-muted/30" : ""}
                  >
                    <TableCell className="font-mono text-xs">
                      {row.requestId.substring(0, 8)}...
                    </TableCell>
                    <TableCell>{formatTimestamp(row.timestamp)}</TableCell>
                    <TableCell>{row.customerName || "-"}</TableCell>
                    <TableCell>{msToSec(row.langdetectionLatency)}</TableCell>
                    <TableCell>{msToSec(row.nmtLatency)}</TableCell>
                    <TableCell>{msToSec(row.llmLatency)}</TableCell>
                    <TableCell>{msToSec(row.ttsLatency)}</TableCell>
                    <TableCell>{msToSec(row.overallPipelineLatency)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={latencyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="langDetection"
                  fill="#8884d8"
                  name="Lang Detection"
                />
                <Bar dataKey="nmt" fill="#82ca9d" name="NMT" />
                <Bar dataKey="llm" fill="#ffc658" name="LLM" />
                <Bar dataKey="tts" fill="#ff8042" name="TTS" />
                <Bar dataKey="overall" fill="#0088FE" name="Overall" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Usage Metrics */}
      <Card className="shadow-lg rounded-2xl flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-black">Usage Metrics</CardTitle>
          <Select value={usageFilter} onValueChange={setUsageFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select customer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Customers</SelectItem>
              {customerNames.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 flex-1">
          <div className="max-h-[400px] overflow-auto border rounded-md">
            <Table>
              <TableHeader className="sticky top-0 bg-muted">
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>NMT (Characters)</TableHead>
                  <TableHead>LLM (Tokens)</TableHead>
                  <TableHead>TTS (Characters)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsageData.map((row, idx) => (
                  <TableRow
                    key={`${row.requestId}-usage`}
                    className={idx % 2 === 0 ? "bg-muted/30" : ""}
                  >
                    <TableCell className="font-mono text-xs">
                      {row.requestId.substring(0, 8)}...
                    </TableCell>
                    <TableCell>{formatTimestamp(row.timestamp)}</TableCell>
                    <TableCell>{row.customerName || "-"}</TableCell>
                    <TableCell>{formatValue(row.nmtUsage)}</TableCell>
                    <TableCell>{formatValue(row.llmUsage)}</TableCell>
                    <TableCell>{formatValue(row.ttsUsage)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="h-[350px] w-full">
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
  );
}