// components/LatencyAdminTable.tsx
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
  timestamp: string;
  customerName: string;
  langDetection: string;
  nmt: string;
  llm: string;
  tts: string;
  overallLatency: string;
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
          <TableHead>Timestamp</TableHead>
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
            <TableCell>{row.timestamp}</TableCell>
            <TableCell>{row.customerName}</TableCell>
            <TableCell>{row.langDetection}</TableCell>
            <TableCell>{row.nmt}</TableCell>
            <TableCell>{row.llm}</TableCell>
            <TableCell>{row.tts}</TableCell>
            <TableCell className="text-right">{row.overallLatency}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
