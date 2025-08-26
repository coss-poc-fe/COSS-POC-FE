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

// types.ts (recommended)
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
  data: AggregateData[]; // now we accept pre-fetched data
}

const CustomerAggregateTable: React.FC<CustomerAggregateProps> = ({ data }) => {
  if (!data || data.length === 0) return <p>No data available</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Latency Table */}
      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle>Latency Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>App</TableHead>
                <TableHead>Lang Detection (s)</TableHead>
                <TableHead>NMT (s)</TableHead>
                <TableHead>LLM (s)</TableHead>
                <TableHead>TTS (s)</TableHead>
                <TableHead>Overall (s)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, idx) => (
                <TableRow key={`latency-${idx}`}>
                  <TableCell>{row.customerName}</TableCell>
                  <TableCell>{row.customerApp}</TableCell>
                  <TableCell>{(row.langdetectionLatency / 1000).toFixed(2)}</TableCell>
                  <TableCell>{(row.nmtLatency / 1000).toFixed(2)}</TableCell>
                  <TableCell>{(row.llmLatency / 1000).toFixed(2)}</TableCell>
                  <TableCell>{(row.ttsLatency / 1000).toFixed(2)}</TableCell>
                  <TableCell>{(row.overallPipelineLatency / 1000).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Usage Table */}
      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle>Usage Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>App</TableHead>
                <TableHead>NMT Usage</TableHead>
                <TableHead>LLM Usage (tokens)</TableHead>
                <TableHead>TTS Usage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, idx) => (
                <TableRow key={`usage-${idx}`}>
                  <TableCell>{row.customerName}</TableCell>
                  <TableCell>{row.customerApp}</TableCell>
                  <TableCell>{row.nmtUsage}</TableCell>
                  <TableCell>{row.llmUsage}</TableCell>
                  <TableCell>{row.ttsUsage}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerAggregateTable;
