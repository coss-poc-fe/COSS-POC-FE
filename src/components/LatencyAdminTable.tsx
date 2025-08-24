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
}

interface LatencyAdminTableProps {
  data: LatencyData[];
  caption?: string;
}

export default function LatencyAdminTable({ data, caption }: LatencyAdminTableProps) {
  return (
    <Table>
      {caption && <TableCaption>{caption}</TableCaption>}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[140px]">Request ID</TableHead>
          <TableHead>Customer Name</TableHead>
          <TableHead>Lang Detection</TableHead>
          <TableHead>NMT</TableHead>
          <TableHead>LLM</TableHead>
          <TableHead>TTS</TableHead>
          <TableHead className="text-right">Overall Latency</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.requestId}>
            <TableCell className="font-medium">{row.requestId}</TableCell>
            <TableCell>{row.customerName}</TableCell>
            <TableCell>{row.langdetectionLatency}ms</TableCell>
            <TableCell>{row.nmtLatency}ms</TableCell>
            <TableCell>{row.llmLatency}ms</TableCell>
            <TableCell>{row.ttsLatency}ms</TableCell>
            <TableCell className="text-right">{row.overallPipelineLatency}ms</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
