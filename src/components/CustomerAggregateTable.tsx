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
  nmtUsage: number;
  llmUsage: number;
  ttsUsage: number;
}

interface CustomerAggregateProps {
  data: AggregateData[];
}

// Chart formatters
const formatLatencyChartData = (data: AggregateData[]) =>
  data.map(item => ({
    name: `${item.customerName}-${item.customerApp}`,
    langDetection: item.langdetectionLatency / 1000,
    nmt: item.nmtLatency / 1000,
    llm: item.llmLatency / 1000,
    tts: item.ttsLatency / 1000,
    overall: item.overallPipelineLatency / 1000,
  }));

const formatUsageChartData = (data: AggregateData[]) =>
  data.map(item => ({
    name: `${item.customerName}-${item.customerApp}`,
    nmt: item.nmtUsage,
    llm: item.llmUsage,
    tts: item.ttsUsage,
  }));

const CustomerAggregateTable: React.FC<CustomerAggregateProps> = ({ data }) => {
  if (!data || data.length === 0) return <p>No data available</p>;

  const latencyChartData = formatLatencyChartData(data);
  const usageChartData = formatUsageChartData(data);

  return (
    <div className="flex w-full h-screen gap-4 p-4 overflow-hidden">
      {/* Left Container */}
      <div className="flex-1 flex flex-col h-full">
        <Card className="shadow-lg rounded-2xl h-full flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle>Latency Metrics</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 flex-1 overflow-hidden">
            {/* Table */}
            <div className="overflow-auto flex-1 border rounded-md">
              <Table>
                <TableHeader className="sticky top-0 bg-muted">
                  <TableRow>
                    <TableHead className="font-bold">Customer Name</TableHead>
                    <TableHead className="font-bold">App</TableHead>
                    <TableHead className="font-bold">Lang Detection (s)</TableHead>
                    <TableHead className="font-bold">NMT (s)</TableHead>
                    <TableHead className="font-bold">LLM (s)</TableHead>
                    <TableHead className="font-bold">TTS (s)</TableHead>
                    <TableHead className="font-bold">Overall (s)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, idx) => (
                    <TableRow key={`latency-${idx}`} className={idx % 2 === 0 ? "bg-muted/30" : ""}>
                      <TableCell>{row.customerName}</TableCell>
                      <TableCell>{row.customerApp}</TableCell>
                      <TableCell>{(row.langdetectionLatency / 1000).toFixed(2)}</TableCell>
                      <TableCell>{(row.nmtLatency / 1000).toFixed(2)}</TableCell>
                      <TableCell>{(row.llmLatency / 1000).toFixed(2)}</TableCell>
                      <TableCell>{(row.ttsLatency / 1000).toFixed(2)}</TableCell>
                      <TableCell className="font-medium">{(row.overallPipelineLatency / 1000).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Latency Chart */}
            <div className="h-[250px] min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={latencyChartData}>
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
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Container */}
      <div className="flex-1 flex flex-col h-full">
        <Card className="shadow-lg rounded-2xl h-full flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle>Usage Metrics</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 flex-1 overflow-hidden">
            {/* Table */}
            <div className="overflow-auto flex-1 border rounded-md">
              <Table>
                <TableHeader className="sticky top-0 bg-muted">
                  <TableRow>
                    <TableHead className="font-bold">Customer Name</TableHead>
                    <TableHead className="font-bold">App</TableHead>
                    <TableHead className="font-bold">NMT Usage</TableHead>
                    <TableHead className="font-bold">LLM Usage (tokens)</TableHead>
                    <TableHead className="font-bold">TTS Usage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, idx) => (
                    <TableRow key={`usage-${idx}`} className={idx % 2 === 0 ? "bg-muted/30" : ""}>
                      <TableCell>{row.customerName}</TableCell>
                      <TableCell>{row.customerApp}</TableCell>
                      <TableCell>{row.nmtUsage}</TableCell>
                      <TableCell>{row.llmUsage}</TableCell>
                      <TableCell>{row.ttsUsage}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Usage Chart */}
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