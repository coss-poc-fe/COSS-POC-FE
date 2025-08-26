'use client';

import * as React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface LatencyData {
  requestId: string;
  customerName: string;
  customerApp: string;
  langdetectionLatency: number;
  nmtLatency: number;
  llmLatency: number;
  ttsLatency: number;
  overallPipelineLatency: number;
  timestamp: string;
}

interface LatencyAdminTableProps {
  data: LatencyData[];
  caption?: string;
}
const msToSec = (val: string | number | null) => {
  if (!val) return 0;
  const num = typeof val === "string" ? parseFloat(val.replace("ms", "")) : val;
  return (num / 1000).toFixed(3); // Keep 3 decimal places
};

export default function LatencyAdminTable({ data, caption }: LatencyAdminTableProps) {
  return (
    <Table>
      {caption && <TableCaption>{caption}</TableCaption>}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[140px]">Request ID</TableHead>
          <TableHead>Timestamp</TableHead>
          <TableHead>Customer Name</TableHead>
          <TableHead>Lang Detection</TableHead>
          <TableHead>NMT (s)</TableHead>
          <TableHead>LLM (s)</TableHead>
          <TableHead>TTS (s)</TableHead>
          <TableHead className="text-right">Overall Latency (s)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.requestId}>
            <TableCell className="font-medium">{row.requestId}</TableCell>
            <TableCell>{new Date(row.timestamp).toLocaleString()}</TableCell>
            <TableCell>{row.customerName}</TableCell>
            <TableCell>{msToSec(row.langdetectionLatency)}</TableCell>
            <TableCell>{msToSec(row.nmtLatency)}</TableCell>
            <TableCell>{msToSec(row.llmLatency)}</TableCell>
            <TableCell>{msToSec(row.ttsLatency)}</TableCell>
            <TableCell className="text-right">{msToSec(row.overallPipelineLatency)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}